import * as Phaser from 'phaser-ce';
import { filter, sample, remove } from 'lodash';
import { ITicker } from '../ticker';
import PeriodicGenerator from '../periodic_generator';
import * as common from '../common';
import HutFactory from '../ui/sprites/hut';
import { game } from '../index';
import Character from '../character/character';

/**
 * Effectively "runs" the game, i.e. instead of just randomly spawning units.
 */
export class GameMechanics {
  private readonly denGenerator: DenGenerator;
  private readonly denSpawnActive: Map<
    Phaser.Tile,
    Hut | undefined
  > = new Map();
  private readonly denSpawnLocations: Phaser.Tile[];
  private readonly denActive: Den[] = [];

  private readonly hutGenerator: HutGenerator;
  private readonly hutSpawnActive: Map<
    Phaser.Tile,
    Hut | undefined
  > = new Map();
  private readonly hutSpawnLocations: Phaser.Tile[];
  private readonly hutActive: Hut[] = [];

  /**
   * Reads significant information based on the provided map.
   *
   * **NOTE**: This does not currently work with generated maps.
   */
  constructor(map: Phaser.Tilemap) {
    const hutLayer: Phaser.TilemapLayer = map.layers[map.getLayer('huts')];
    if (hutLayer) {
      this.hutSpawnLocations = this.findSpawnLocations(hutLayer);
      for (const result of this.hutSpawnLocations) {
        this.hutSpawnActive.set(result, undefined);
      }
      this.hutGenerator = new HutGenerator(
        this.spawnHutIntoWorld.bind(this),
        common.globals.gameplay.hutSpawnRateMs,
        new HutFactory(game)
      );
      game.generators.push(this.hutGenerator);
      common.debug.log('Hut spawn locations: ', this.hutSpawnActive.size);
    }

    const denLayer: Phaser.TilemapLayer = map.layers[map.getLayer('spawns')];
    if (denLayer) {
      this.denSpawnLocations = this.findSpawnLocations(denLayer);
      for (const result of this.denSpawnLocations) {
        this.denSpawnActive.set(result, undefined);
      }
      this.denGenerator = new DenGenerator(
        this.spawnDenIntoWorld.bind(this),
        common.globals.gameplay.denSpawnRateMs,
        new HutFactory(game)
      );
      game.generators.push(this.denGenerator);
      common.debug.log('Den spawn locations: ', this.denSpawnActive.size);
    }

    // Setup game looping mechanics:
    // Have the goblin AI "think" every 1s.
    game.time.events.loop(
      common.globals.gameplay.goblinThinkRateMs,
      this.giveGoblinOrders,
      this
    );

    // Have the NPCs "attack" when in range of enemies.
    game.time.events.loop(
      common.globals.gameplay.npcAttackRateMs,
      this.attackNearbyEnemies,
      this
    );
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
      common.debug.log('Tried to spawn a hut, but no locations idle.');
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

  /**
   * Attempts to give goblins orders.
   *
   * This method should *not* be called every game loop, but rather a bit less
   * often. "Smarter" goblins could have this loop called more often, for
   * example.
   *
   * Intended priority (not implemented):
   *   1. Attack in-range enemy
   *   2. Move to attack NPCs
   *   3. Move to attack PCs
   *   4. Move to attack Huts
   *   5. Wander
   *
   * Future:
   *   - "Horde Mode": Follow other goblins as they do their tasks.
   */
  private giveGoblinOrders(): void {
    for (const goblin of filter(game.worldState.characters, c => c.isGoblin)) {
      // Do nothing, just attack.
      if (this.hasEnemyWithinAttackRange(goblin)) {
        return;
      }
      const enemy = this.findClosestEnemy(goblin);
      if (enemy) {
        common.debug.log('Ordered goblin to attack!');
        this.orderMove(goblin, enemy.target.getWorldPosition());
        return;
      }
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
    for (const char of game.worldState.characters) {
      if (char.isArmed) {
        char.weapon.update();
      }
      if (char.isAttacking) {
        if (this.hasEnemyWithinAttackRange(char)) {
          this.hitWithWeapon(char);
        }
      }
    }
  }

  /**
   * Whether the provided characters are on opposing sides.
   *
   * @param who
   * @param to
   */
  private isOpposed(who: Character, to: Character): boolean {
    return who.isGoblin !== to.isGoblin;
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
    remove(game.worldState.characters, defender => {
      if (defender === attacker) {
        return false;
      }
      if (this.withinRange(range, attacker.getSprite(), defender.getSprite())) {
        return this.dealDamage(defender, attacker);
      }
      return false;
    });
  }

  /**
   * Deal damage to a N/PC.
   *
   * @param injure
   * @param source
   */
  private dealDamage(injure: Character, source: Character): boolean {
    if (!this.isOpposed(injure, source)) {
      return false;
    }
    const sprite = injure.getSprite();
    sprite.damage(1);
    injure.hud.updateHealthBar();
    game.blood.sprite(sprite);
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
    game.worldState.directCharacterToPoint(
      source,
      new Phaser.Point(target.x, target.y)
    );
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
    if (!(target instanceof Phaser.Sprite)) {
      return this.withinRange(range, source, target.sprite);
    }
    // TODO: Implement this better.
    return game.physics.arcade.distanceBetween(source, target) <= range * 48;
  }

  /**
   * Returns the closet enemy.
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
}

export class Hut {
  constructor(public readonly sprite: Phaser.Sprite) {}
}

export class HutGenerator implements ITicker {
  private periodicGenerator: PeriodicGenerator<Hut>;

  public constructor(
    private readonly spawn: (den: Den) => any,
    period: number,
    factory: HutFactory
  ) {
    this.periodicGenerator = new PeriodicGenerator<Hut>(
      period,
      (_: number) => new Hut(factory.hut())
    );
  }

  public tick(elapsed: number) {
    this.periodicGenerator.tick(elapsed).forEach(this.spawn);
  }
}

export class Den {
  constructor(public readonly sprite: Phaser.Sprite) {}
}

export class DenGenerator implements ITicker {
  private periodicGenerator: PeriodicGenerator<Den>;

  public constructor(
    private readonly spawn: (den: Den) => any,
    period: number,
    factory: HutFactory
  ) {
    this.periodicGenerator = new PeriodicGenerator<Den>(
      period,
      (_: number) => new Den(factory.den())
    );
  }

  public tick(elapsed: number) {
    this.periodicGenerator.tick(elapsed).forEach(this.spawn);
  }
}
