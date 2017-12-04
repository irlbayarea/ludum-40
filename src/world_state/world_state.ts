import * as EasyStar from 'easystarjs';
import * as common from '../common';
import * as Phaser from 'phaser-ce';

import Grid from './grid';
import Path from './path';
import Character from '../character/character';
import { game } from '../index';
import { Weapon } from '../ui/sprites/weapon';
import { remove } from 'lodash';
import { GameMechanics } from './mechanics';
import Goal from '../character/goal';

/**
 */
export default class WorldState {
  public static toWorldCoords(physicsCoords: {
    x: number;
    y: number;
  }): { x: number; y: number } {
    return { x: physicsCoords.x / 64, y: physicsCoords.y / 64 };
  }

  public static fromWordCoords(physicsCoords: {
    x: number;
    y: number;
  }): { x: number; y: number } {
    return { x: physicsCoords.x * 64, y: physicsCoords.y * 64 };
  }

  /**
   * Moves a character on a given tick toward the target point. Use functions
   * like `directCharacterToPoint` to control character movement.
   */
  private static moveCharacterTick(
    char: Character,
    towards: Phaser.Point
  ): void {
    const body = char.getSprite().body;
    const p: Phaser.Point = new Phaser.Point(body.x, body.y);
    const p2: Phaser.Point = new Phaser.Point(towards.x, towards.y);
    const dir: Phaser.Point = p2
      .subtract(p.x, p.y)
      .normalize()
      .multiply(char.speed, char.speed);
    char.getSprite().body.moveDown(dir.y);
    char.getSprite().body.moveRight(dir.x);
  }

  public readonly characters: Character[];

  public readonly grid: Grid;
  private readonly astar: EasyStar.js;

  private playerKills: number = 0;
  private goblinKills: number = 0;
  private guardKills: number = 0;
  private hutDestroyed: number = 0;
  private denDesdtroyed: number = 0;

  /**
   * Whether the player character released the attack key.
   *
   * This prevents holding down the attack key for infinite attacks.
   */
  private releasedSwing: boolean = true;
  private mMap: Phaser.Tilemap;
  private mechanics: GameMechanics;

  public get playerCharacter(): Character {
    return this.mPlayerCharacter;
  }
  public set playerCharacter(character: Character) {
    this.mPlayerCharacter = character;
    let isNewCharacter: boolean = true;
    for (const char of this.characters) {
      if (char === character) {
        isNewCharacter = false;
      }
    }
    if (isNewCharacter) {
      this.characters.push(character);
    }
  }
  private mPlayerCharacter: Character;

  public constructor(gridw: number, gridh: number) {
    this.grid = new Grid(gridw, gridh);
    this.astar = new EasyStar.js();
    this.astar.setGrid(this.grid.collisions);
    this.astar.setAcceptableTiles([0]);
    this.characters = [];
  }
  public getPlayerKills(): number {
    return this.playerKills;
  }
  public incrementPlayerKills() {
    this.playerKills += 1;
  }
  public getDeadGoblins(): number {
    return this.goblinKills;
  }
  public incrementGoblinKills() {
    this.goblinKills += 1;
  }
  public getDeadGuards(): number {
    return this.guardKills;
  }
  public incrementGuardKills() {
    this.guardKills += 1;
  }
  public getHutDestroyed(): number {
    return this.hutDestroyed;
  }
  public incrementHutDestroyed() {
    this.hutDestroyed += 1;
  }
  public getDenDesdtroyed(): number {
    return this.denDesdtroyed;
  }
  public incrementDenDesdtroyed() {
    this.denDesdtroyed += 1;
  }
  public getHutCount() {
    return this.mechanics.getHutCount();
  }
  public resetKillCounts() {
    this.playerKills = 0;
    this.goblinKills = 0;
    this.guardKills = 0;
    this.hutDestroyed = 0;
    this.denDesdtroyed = 0;
  }
  /**
   * Sets the map parameter based on the provided map.
   *
   * @param map
   */
  public setMap(map: Phaser.Tilemap): void {
    this.mMap = map;
  }

  /**
   * Returns the current map instance.
   */
  public getMap(): Phaser.Tilemap {
    return this.mMap;
  }

  /**
   * Updates collision based on the given tilemap layer. Any tiles that exist in the layer are blocking.
   */
  public setCollisionFromTilemap(
    map: Phaser.Tilemap,
    layer: Phaser.TilemapLayer
  ): void {
    // Must use transposed grid for our A* algorithm.
    const trans: number[][] = [];
    this.mechanics = new GameMechanics(map);
    for (let y = 0; y < map.height; y++) {
      trans[y] = [];
      for (let x = 0; x < map.width; x++) {
        const tile = map.getTile(x, y, layer);
        this.grid.collisions[x][y] = tile !== null ? 1 : 0;
        trans[y][x] = tile !== null ? 1 : 0;
      }
    }
    this.astar.setGrid(trans);
  }

  /**
   * Adds a character to the game state, initializing its physics. Expects a Character object with a sprite.
   *
   * DO NOT USE.
   */
  public addCharacter(character: Character): void {
    this.characters.push(character);
    // Hack to set player follow cam.
    if (this.characters.length === 1) {
      game.camera.follow(character.getSprite());
      character.getSprite().health = character.getSprite().maxHealth =
        common.globals.gameplay.playerStartingHP;
      this.playerCharacter = character;
      this.playerCharacter.arm(Weapon.sword());
    }
  }

  public randomNearbyPoint(
    point: Phaser.Point,
    distance: number
  ): Phaser.Point {
    return new Phaser.Point(
      this.clampx((Math.random() - 0.5) * 2 * distance + point.x),
      this.clampx((Math.random() - 0.5) * 2 * distance + point.y)
    );
  }

  public update(): void {
    this.mechanics.mainLoop();
    this.updateCharacters();
  }

  public render(): void {
    this.renderCharacters();
    if (common.experiment('render-debug')) {
      this.renderDebug();
    }
  }

  /**
   * Whether the provided characters are on opposing sides.
   *
   * @param who
   * @param to
   */
  public isOpposed(who: Character, to: Character): boolean {
    return who.isGoblin !== to.isGoblin;
  }

  private renderCharacters(): void {
    this.characters.forEach(c => {
      c.hud.sprayBlood();
    });
  }

  private renderDebug() {
    // Render collision debug.
    this.characters
      .filter(c => c.drawDebugPaths && c.path !== null)
      .forEach(c => {
        c.path!.drawDebug(c.getWorldPosition());
      });

    // Render pathing debug.
    for (let x: number = 0; x < this.grid.w; x++) {
      for (let y: number = 0; y < this.grid.h; y++) {
        const p: Phaser.Point = new Phaser.Point(x + 0.5, y + 0.5);
        const color: string = this.grid.collisionWorldPoint(p)
          ? 'rgba(255,0,255,128)'
          : 'rgba(0,255,0,128)';
        const circ: Phaser.Circle = new Phaser.Circle(p.x * 64, p.y * 64, 15);
        game.debug.geom(circ, color, true);
      }
    }
  }

  /**
   * Takes `from` and `to` which must be world space coordinates, or a distance
   * of 1.00 every tile. Returns a Path or null if no path could be found. Make
   * sure to use center positions of entities.
   */
  private pathfind(from: Phaser.Point, to: Phaser.Point): Path | null {
    const points: Phaser.Point[] = [];
    this.astar.setIterationsPerCalculation(10000000);
    this.astar.findPath(
      Math.floor(from.x),
      Math.floor(from.y),
      Math.floor(to.x),
      Math.floor(to.y),
      path => {
        if (path !== null) {
          for (let i = 0; i < path.length; i++) {
            points[i] = new Phaser.Point(path[i].x, path[i].y);
          }
        }
      }
    );
    this.astar.enableSync();
    this.astar.enableDiagonals();
    this.astar.disableCornerCutting();
    this.astar.calculate();
    return points.length >= 1 ? new Path(points) : null;
  }

  /**
   * Clamps an x world coordinate to the world.
   */
  private clampx(n: number) {
    return Math.max(0, Math.min(this.grid.h - 0.001, n));
  }

  private updateCharacters(): void {
    this.updateCharacterBehaviors();
    this.updateCharacterPhysics();
    this.updatePlayerCharacter();
  }

  private updateCharacterPhysics(): void {
    this.characters.forEach(char => {
      char.getSprite().body.setZeroVelocity();
    });

    // Pathfinding update.
    this.characters.filter(c => c.path !== null).forEach(c => {
      const path: Path = c.path!;
      const goalPos: Phaser.Point | null = path.currentGoal();
      const curPos: Phaser.Point = c.getWorldPosition();

      if (goalPos === null) {
        c.path = null;
      } else if (Path.isNearGoal(curPos, goalPos)) {
        path.advance();
      } else {
        WorldState.moveCharacterTick(
          c,
          new Phaser.Point(goalPos.x * 64, goalPos.y * 64)
        );
      }
    });
  }

  private updateCharacterBehaviors(): void {
    this.characters.forEach(c => {
      const goal: Goal = c.goal;
      switch (c.goal.type) {
        // Idle Goal.
        case Goal.TYPE_IDLE:
          {
            goal.state = goal.state; // Leave me alone, linter!
          }
          break;

        // Move To Goal.
        case Goal.TYPE_MOVE_TO:
          {
            if (goal.state === Goal.STATE_START) {
              this.directCharacterToPoint(c, goal.targetPoint!);
              goal.state = Goal.STATE_ACTIVE;
            }
            if (goal.state === Goal.STATE_ACTIVE) {
              if (c.path === null) {
                goal.state = Goal.STATE_DONE;
              }
            } else if (goal.state === Goal.STATE_DONE) {
              c.goal = Goal.idle();
            }
          }
          break;

        // Attack Character Goal.
        case Goal.TYPE_ATTACK_CHAR:
          {
            goal.state = goal.state; // Leave me alone, linter!
          }
          break;

        // Wander Goal.
        case Goal.TYPE_WANDER:
          {
            if (goal.state === Goal.STATE_START) {
              // Cancel whatever you were doing and start wandering.
              c.path = null;
              goal.state = Goal.STATE_ACTIVE;
            }
            if (goal.state === Goal.STATE_ACTIVE) {
              // When path is null, find a new path.
              if (c.path === null) {
                let p: Phaser.Point | null = null;
                let remainingTries: number = 3;
                do {
                  p = this.randomNearbyPoint(c.getWorldPosition(), 10);
                  remainingTries--;
                  if (this.grid.collisionWorldPoint(p)) {
                    p = null;
                  }
                } while (p == null && remainingTries > 0);
                if (p !== null) {
                  this.directCharacterToPoint(c, p);
                }
              }
            }
          }
          break;
      }
    });
  }

  private updatePlayerCharacter(): void {
    if (game.worldState.playerCharacter.getSprite().health === 0) {
      remove(this.characters, _ => true);
      game.state.start(
        'Over',
        true,
        false,
        `You died after killing ${game.worldState.getDeadGoblins()} goblins!`
      );
    } else if (game.worldState.getHutCount() === 0) {
      remove(this.characters, _ => true);
      game.state.start(
        'Over',
        true,
        false,
        `You lots all your huts after killing ${game.worldState.getDeadGoblins()} goblins!`
      );
    }

    // Player Controls.
    if (game.controller.isLeft && !game.controller.isRight) {
      game.worldState.playerCharacter.getSprite().body.moveLeft(400);
    } else if (game.controller.isRight) {
      game.worldState.playerCharacter.getSprite().body.moveRight(400);
    }
    if (game.controller.isDown && !game.controller.isUp) {
      game.worldState.playerCharacter.getSprite().body.moveUp(400);
    } else if (game.controller.isUp) {
      game.worldState.playerCharacter.getSprite().body.moveDown(400);
    }
    if (game.worldState.playerCharacter.isArmed) {
      if (game.controller.isSpace && this.releasedSwing) {
        game.worldState.playerCharacter.weapon.markInUse();
        this.releasedSwing = false;
      } else if (!game.controller.isSpace) {
        this.releasedSwing = true;
      }
    }
  }

  /**
   * Tells the character to get to the given point in world coordinates (1
   * tile = 1.00 distance). Returns true if able to do that. The character
   * and destination must not be on a blocking point.
   */
  private directCharacterToPoint(
    char: Character,
    point: Phaser.Point
  ): boolean {
    if (this.grid.collisionWorldPoint(char.getWorldPosition())) {
      return false;
    }
    if (this.grid.collisionWorldPoint(point)) {
      return false;
    }
    try {
      char.path = this.pathfind(char.getWorldPosition(), point);
    } catch (e) {
      common.debug.log('directCharacterToPoint: pathfinding exception.');
    }
    return char.path !== null;
  }
}
