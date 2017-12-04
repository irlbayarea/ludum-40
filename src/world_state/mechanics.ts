import { Point } from 'phaser-ce';
import { filter, sample, remove, random, shuffle } from 'lodash';
import * as common from '../common';
import HutFactory from '../ui/sprites/hut';
import { game } from '../index';
import Character, { CharacterType } from '../character/character';
import {
  Armory,
  SkinColor,
  ShirtColor,
  PantsColor,
  HairColor,
  ShieldColor,
} from '../ui/sprites/armory';
import { Weapon } from '../ui/sprites/weapon';
import { SpawnConfig } from '../character/spawn_config';
import Goal from '../character/goal';
import { randomName } from '../character/names';

/**
 * Effectively "runs" the game, i.e. instead of just randomly spawning units.
 */
export class GameMechanics {
  private readonly denSpawnActive: Map<
    Phaser.Tile,
    Hut | undefined
  > = new Map();
  private readonly denSpawnLocations: Phaser.Tile[];
  private readonly denActive: Den[] = [];

  private readonly hutSpawnActive: Map<
    Phaser.Tile,
    Hut | undefined
  > = new Map();
  private readonly hutSpawnLocations: Phaser.Tile[];
  private readonly hutActive: Hut[] = [];

  private readonly armory: Armory;

  /**
   * Reads significant information based on the provided map.
   *
   * **NOTE**: This does not currently work with generated maps.
   */
  constructor(map: Phaser.Tilemap) {
    this.armory = new Armory(game);

    const hutLayer: Phaser.TilemapLayer = map.layers[map.getLayer('huts')];
    if (hutLayer) {
      this.hutSpawnLocations = this.findSpawnLocations(hutLayer);
      for (const result of this.hutSpawnLocations) {
        this.hutSpawnActive.set(result, undefined);
      }
      game.time.events.loop(common.globals.gameplay.hutSpawnRateMs, () => {
        this.spawnHutIntoWorld(new Hut(new HutFactory(game).hut()));
      });
      this.spawnHutIntoWorld(new Hut(new HutFactory(game).hut()));
      this.spawnHutIntoWorld(new Hut(new HutFactory(game).hut()));
    }

    const denLayer: Phaser.TilemapLayer = map.layers[map.getLayer('spawns')];
    if (denLayer) {
      this.denSpawnLocations = this.findSpawnLocations(denLayer);
      for (const result of this.denSpawnLocations) {
        this.denSpawnActive.set(result, undefined);
      }
      game.time.events.loop(common.globals.gameplay.hutSpawnRateMs, () => {
        this.spawnDenIntoWorld(new Den(new HutFactory(game).den()));
      });
      this.spawnDenIntoWorld(new Den(new HutFactory(game).den()));
    }

    // Setup game looping mechanics:
    // Have the goblin AI "think" every 1s.
    game.time.events.loop(
      common.globals.gameplay.goblinThinkRateMs,
      this.giveNpcOrders,
      this
    );

    // Have the NPCs "attack" when in range of enemies.
    game.time.events.loop(
      common.globals.gameplay.npcAttackRateMs,
      this.attackNearbyEnemies,
      this
    );

    // Spawn goblins/hordes from dens.
    game.time.events.loop(
      common.globals.gameplay.goblinSpawnRateMs,
      this.spawnGoblins,
      this
    );

    // Offer NPC contracts.
    game.time.events.loop(
      common.globals.gameplay.contractRateMs,
      this.offerContracts,
      this
    );

    // Maybe use new promotion logic.
    if (common.experiment('promotions')) {
      game.time.events.loop(
        common.globals.gameplay.promotionsRateMs,
        this.offerPromotions,
        this
      );
    }
  }

  /**
   * Forward events from the main game "update" loop.
   */
  public mainLoop(): void {
    this.dealDamageIfNeeded();
  }

  /**
   * Given a den, spawn it into the world.
   *
   * @param den
   */
  private spawnDenIntoWorld(den: Den): void {
    const location = this.getDenSpawnLocation();
    if (location === undefined) {
      den.sprite.kill();
      return;
    }
    this.denSpawnActive.set(location, den);
    this.denActive.push(den);
    den.sprite.x = location.x * 64;
    den.sprite.y = location.y * 64;
  }

  /**
   * Given a hut, spawn it into the world.
   *
   * @param hut
   */
  private spawnHutIntoWorld(hut: Hut): void {
    const location = this.getHutSpawnLocation();
    if (location === undefined) {
      hut.sprite.kill();
      return;
    }
    this.hutSpawnActive.set(location, hut);
    this.hutActive.push(hut);
    hut.sprite.x = location.x * 64;
    hut.sprite.y = location.y * 64;
  }

  /**
   * Returns a random but available den spawn location.
   */
  private getDenSpawnLocation(): Phaser.Tile | undefined {
    return sample(
      filter(this.denSpawnLocations, k => !this.denSpawnActive.get(k))
    );
  }

  /**
   * Returns a random but available hut spawn location.
   */
  private getHutSpawnLocation(): Phaser.Tile | undefined {
    return sample(
      filter(this.hutSpawnLocations, k => !this.hutSpawnActive.get(k))
    );
  }

  /**
   * Finds all valid spawn locations on the given layer.
   *
   * @param layer
   */
  private findSpawnLocations(layer: Phaser.TilemapLayer): Phaser.Tile[] {
    const rows: Phaser.Tile[][] = layer.data;
    const results: Phaser.Tile[] = [];
    const visited: { [key: string]: boolean } = {};
    for (const row of rows) {
      for (const cell of filter(row, c => c.index !== -1)) {
        const self = this.hashCell(cell);
        const north = this.hashCell(cell, 0, -1);
        const west = this.hashCell(cell, -1, 0);
        if (!visited[north] && !visited[west]) {
          results.push(cell);
        }
        visited[self] = true;
      }
    }
    return results;
  }

  private hashCell(cell: Phaser.Tile, modX = 0, modY = 0): string {
    return `{${cell.x + modX}, ${cell.y + modY}}`;
  }

  private worldPositionOfSprite(sprite: Phaser.Sprite): Phaser.Point {
    return new Phaser.Point(sprite!.x / 64, sprite!.y / 64);
  }

  private offerContracts(): void {
    if (!game.isOfferingContract && this.hutActive.length > 0) {
      game.offerContract(this.createRandomGuard(), character => {
        const hairColor = sample([
          HairColor.Black,
          HairColor.Blonde,
          HairColor.Brown,
          HairColor.Orange,
          HairColor.White,
        ]) as HairColor;
        const hairStyle = random(0, 12);
        const beardStyle = random(0, 6);
        const texture = this.armory.peonTexture({
          skin: sample([
            SkinColor.Brown,
            SkinColor.Tan,
            SkinColor.White,
          ]) as SkinColor,
          shirt: {
            color: sample([
              ShirtColor.Black,
              ShirtColor.Orange,
              ShirtColor.Purple,
              ShirtColor.Tan,
              ShirtColor.Teal,
            ]) as ShirtColor,
            style: random(0, 15),
          },
          pants: sample([
            PantsColor.Black,
            PantsColor.Brown,
            PantsColor.Orange,
            PantsColor.Purple,
            PantsColor.Teal,
          ]),
          hair:
            hairStyle < 12
              ? {
                  color: hairColor,
                  style: random(0, 11),
                }
              : undefined,
          beard:
            beardStyle < 4
              ? {
                  color: hairColor,
                  style: beardStyle,
                }
              : undefined,
        });
        this.spawnRandomGuard(character, texture);
      });
    }
  }

  private spawnRandomGuard(
    character: Character,
    texture: Phaser.RenderTexture
  ): void {
    // const location = sample(this.hutActive) as Hut;
    const { x, y } = game.worldState.playerCharacter.getSprite();
    character.arm(Weapon.scimitar());
    const sprite = game.spawn(
      new SpawnConfig(
        character,
        texture,
        Math.floor(x / 64),
        Math.floor(y / 64)
      )
    );
    sprite.maxHealth = sprite.health = 5;
  }

  private createRandomGuard(): Character {
    return new Character(randomName(), CharacterType.Guard);
  }

  private spawnGoblins(): void {
    if (
      this.denActive.length === 0 ||
      game.worldState.characters.length >
        common.globals.gameplay.maximumCharacters
    ) {
      return;
    }
    for (const den of this.denActive) {
      for (let i = 0; i < random(0, 3); i++) {
        const x = Math.floor(den.sprite.x / 64);
        const y = Math.floor(den.sprite.y / 64);
        this.spawnGoblinPeon(x, y);
      }
    }
  }

  private offerPromotions(): void {
    for (const goblin of filter(game.worldState.characters, c => c.isGoblin)) {
      const sprite = goblin.getSprite();
      if (sprite.maxHealth >= 25) {
        continue;
      }
      const buddies = filter(this.findNearbyBudies(goblin), c => {
        return c.getSprite().maxHealth === sprite.maxHealth;
      });
      if (buddies.length >= 5) {
        sprite.maxHealth *= 5;
        sprite.health = sprite.maxHealth;
        sprite.setTexture(this.createGoblinTexture(sprite.maxHealth));
      }
    }
  }

  private findNearbyBudies(character: Character): Character[] {
    return filter(game.worldState.characters, c => {
      return (
        c !== character &&
        this.withinRange(3.5, character.getSprite(), c.getSprite())
      );
    });
  }

  private spawnGoblinPeon(x: number, y: number): void {
    const character = new Character('Goblin', CharacterType.Goblin);
    const texture = this.createGoblinTexture();
    character.arm(Weapon.axe());
    game.spawn(new SpawnConfig(character, texture, x, y));
  }

  private createGoblinTexture(health: number = 1): Phaser.RenderTexture {
    if (health >= 25) {
      return this.armory.peonTexture({
        skin: SkinColor.Green,
        lips: true,
        shirt: {
          color: ShirtColor.Green,
          style: 13,
        },
        pants: PantsColor.Teal,
        beard: {
          color: HairColor.Black,
          style: 3,
        },
        hat: 3,
        shield: {
          color: ShieldColor.BronzeTeal,
          style: 1,
        },
      });
    }
    if (health >= 5) {
      return this.armory.peonTexture({
        skin: SkinColor.Green,
        lips: true,
        shirt: {
          color: ShirtColor.Green,
          style: 13,
        },
        pants: PantsColor.Teal,
        beard: {
          color: HairColor.Black,
          style: 3,
        },
      });
    }
    return this.armory.peonTexture({
      skin: SkinColor.Green,
      shirt: {
        color: ShirtColor.Green,
        style: 9,
      },
      pants: PantsColor.Green,
    });
  }

  /**
   * Attempts to give NPCs orders.
   *
   * This method should *not* be called every game loop, but rather a bit less
   * often. "Smarter" goblins could have this loop called more often, for
   * example.
   *
   * Intended priority for Goblins (not 100% implemented):
   *   1. Attack in-range enemy
   *   2. Move to attack N/PCs
   *   3. Move to attack Huts
   *   4. Wander
   *
   * Future:
   *   - "Horde Mode": Follow other goblins as they do their tasks.
   */
  private giveNpcOrders(): void {
    for (const npc of game.worldState.characters) {
      if (npc === game.worldState.playerCharacter) {
        continue;
      }
      // Do nothing, just attack.
      if (this.hasEnemyWithinAttackRange(npc)) {
        npc.goal = Goal.attack(this.findClosestEnemy(npc)!.target);
        continue;
      }
      const enemy = this.findClosestEnemy(npc);
      if (
        enemy &&
        enemy.distance <= common.globals.gameplay.goblinVisionDistance
      ) {
        this.orderMove(npc, enemy.target.getWorldPosition());
        continue;
      }
      const enemyHut = this.findClosestBuilding(npc);
      if (
        enemyHut &&
        enemyHut.distance <= common.globals.gameplay.goblinVisionDistance
      ) {
        this.orderMove(npc, this.worldPositionOfSprite(enemyHut.target.sprite));
        continue;
      }
      npc.goal = Goal.wander();
    }
  }

  /**
   * If near an enemy, swing weapon.
   */
  private attackNearbyEnemies(): void {
    for (const source of game.worldState.characters) {
      if (source === game.worldState.playerCharacter) {
        continue;
      }
      if (this.hasEnemyWithinAttackRange(source)) {
        source.swing();
      }
    }
  }

  /**
   * If mid-swing and near an enemy, deal damage.
   */
  private dealDamageIfNeeded(): void {
    for (const char of shuffle(game.worldState.characters)) {
      if (char.isArmed) {
        if (char.weapon.isHitting) {
          if (this.hasEnemyWithinAttackRange(char)) {
            this.hitWithWeapon(char);
          }
        }
        char.weapon.update();
      }
    }
  }

  /**
   * Whether the provided characters are on opposing sides.
   *
   * @param who
   * @param to
   */
  private isOpposed(who: Character, to: Character | Hut | Den): boolean {
    if (to instanceof Character) {
      return who.isGoblin !== to.isGoblin;
    }
    return who.isGoblin !== to instanceof Den;
  }

  /**
   * Hit all characters and entities within range of the provided attacker.
   *
   * This is expected to called internally.
   *
   * @param attacker
   */
  private hitWithWeapon(attacker: Character): void {
    const range = this.getWeaponRange(attacker);
    const deadCharacters: Character[] = remove(
      game.worldState.characters,
      defender => {
        if (defender === attacker) {
          return false;
        }
        if (
          this.withinRange(range, attacker.getSprite(), defender.getSprite())
        ) {
          return this.dealDamage(defender, attacker);
        }
        return false;
      }
    );
    for (const char of deadCharacters) {
      if (char.isGoblin) {
        game.worldState.incrementGoblinKills();
      } else {
        game.worldState.incrementGuardKills();
      }
    }
    const deadBuildings: IBuilding[] = remove(
      attacker.isGoblin ? this.hutActive : this.denActive,
      defender => {
        if (this.withinRange(range, attacker.getSprite(), defender.sprite)) {
          return this.dealDamage(defender, attacker);
        }
        return false;
      }
    );
    for (const b of deadBuildings) {
      if (b instanceof Hut) {
        game.worldState.incrementHutDestroyed();
      } else if (b instanceof Den) {
        game.worldState.incrementDenDesdtroyed();
      }
    }
  }

  /**
   * Deal damage to a N/PC.
   *
   * @param injure
   * @param source
   */
  private dealDamage(
    injure: Character | Hut | Den,
    source: Character
  ): boolean {
    if (!this.isOpposed(source, injure)) {
      return false;
    }
    const sprite = (injure as Hut).sprite || (injure as Character).getSprite();
    sprite.damage(1);
    if (injure instanceof Character) {
      game.blood.blood(sprite);
      (injure as Character).hud.updateHealthBar();
    } else {
      game.blood.boom(sprite);
    }
    if (sprite.health === 0) {
      return true;
    }
    return false;
  }

  /**
   * Returns the computed weapon + reach range of the provided character.
   *
   * @param source
   */
  private getWeaponRange(source: Character): number {
    const rangeModifier =
      source === game.worldState.playerCharacter
        ? common.globals.gameplay.playerRangeModifier
        : 0;
    return source.weapon.range + rangeModifier;
  }

  /**
   * Orders the character to move.
   *
   * @param source
   * @param target
   */
  private orderMove(source: Character, target: { x: number; y: number }): void {
    source.goal = Goal.moveTo(new Point(target.x, target.y));
  }

  /**
   * Returns whethe the provided character has an enemy within attack range.
   *
   * @param source
   */
  private hasEnemyWithinAttackRange(source: Character): boolean {
    if (!source.isArmed) {
      return false;
    }
    const sourcePos = source.getWorldPosition();
    const range = this.getWeaponRange(source);
    for (const potential of game.worldState.characters) {
      if (potential === source) {
        continue;
      }
      if (!this.isOpposed(source, potential)) {
        continue;
      }
      if (sourcePos.distance(potential.getWorldPosition()) <= range) {
        return true;
      }
    }
    if (source.isGoblin) {
      for (const hut of this.hutActive) {
        if (this.withinRange(range, source.getSprite(), hut)) {
          return true;
        }
      }
    }
    if (!source.isGoblin) {
      for (const den of this.denActive) {
        if (this.withinRange(range, source.getSprite(), den)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Returns whether [source] and [target] are within range.
   */
  private withinRange(
    range: number,
    source: Phaser.Sprite,
    target: Phaser.Sprite | { sprite: Phaser.Sprite }
  ): boolean {
    if ('sprite' in target) {
      return this.withinRange(
        range,
        source,
        (target as { sprite: Phaser.Sprite }).sprite
      );
    }
    // TODO: Implement this better.
    return game.physics.arcade.distanceBetween(source, target) <= range * 48;
  }

  /**
   * Returns the closest enemy.
   *
   * @param source
   */
  private findClosestEnemy(
    source: Character
  ): { target: Character; distance: number } | undefined {
    const sourcePos = source.getWorldPosition();
    let target: Character | null = null;
    let targetDistance: number = 1000;
    for (const potential of game.worldState.characters) {
      if (
        potential === source ||
        !game.worldState.isOpposed(source, potential)
      ) {
        continue;
      }
      const potentialPos = potential.getWorldPosition();
      const distance = sourcePos.distance(potentialPos);
      if (distance < targetDistance) {
        target = potential;
        targetDistance = distance;
      }
    }
    return target
      ? {
          target,
          distance: targetDistance,
        }
      : undefined;
  }

  /**
   * Returns the closest hut or den.
   *
   * @param source
   */
  private findClosestBuilding(
    source: Character
  ): { target: Hut | Den; distance: number } | undefined {
    const sourcePos = source.getWorldPosition();
    let target: Hut | Den | null = null;
    let targetDistance: number = 1000;
    const targets = source.isGoblin ? this.hutActive : this.denActive;
    for (const potential of targets) {
      const potentialPos = potential.sprite.worldPosition as Phaser.Point;
      const distance = sourcePos.distance(potentialPos) / 64;
      if (distance < targetDistance) {
        target = potential;
        targetDistance = distance;
      }
    }
    return target
      ? {
          target,
          distance: targetDistance,
        }
      : undefined;
  }
}

interface IBuilding {
  getBuildingType(): string;
}

class Hut implements IBuilding {
  constructor(public readonly sprite: Phaser.Sprite) {}
  public getBuildingType(): string {
    return 'Hut';
  }
}

class Den implements IBuilding {
  constructor(public readonly sprite: Phaser.Sprite) {}
  public getBuildingType(): string {
    return 'Den';
  }
}
