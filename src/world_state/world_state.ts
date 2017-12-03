import * as Phaser from 'phaser-ce';
import * as EasyStar from 'easystarjs';

import Grid from './grid';
import Path from './path';
import Character from '../character/character';

/**
 */
export default class WorldState {
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

  public readonly grid: Grid;
  public readonly characters: Character[];

  private readonly astar: EasyStar.js;

  public constructor(gridw: number, gridh: number) {
    this.grid = new Grid(gridw, gridh);
    this.astar = new EasyStar.js();
    this.astar.setGrid(this.grid.collisions);
    this.astar.setAcceptableTiles([0]);
    this.characters = [];
  }

  /**
   * Updates collision based on the given tilemap layer. Any tiles that exist in the layer are blocking.
   */
  public setCollisionFromTilemap(
    map: Phaser.Tilemap,
    layer: Phaser.TilemapLayer
  ): void {
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.getTile(x, y, layer);
        this.grid.collisions[x][y] = tile !== null ? 1 : 0;
      }
    }
    this.astar.setGrid(this.grid.collisions);
  }

  /**
   * Takes `from` and `to` which must be world space coordinates, or a distance
   * of 1.00 every tile. Returns a Path or null if no path could be found.
   */
  public pathfind(from: Phaser.Point, to: Phaser.Point): Path | null {
    const points: Array<{ x: number; y: number }> = [];
    this.astar.setIterationsPerCalculation(10000000000);
    this.astar.findPath(
      Math.floor(from.x),
      Math.floor(from.y),
      Math.floor(to.x),
      Math.floor(to.y),
      path => {
        if (path !== null) {
          for (let i = 1; i < path.length; i++) {
            // Flip x,y because of the way it's stored inside pathfinding algo.
            points[i - 1] = { x: path[i].y, y: path[i].x };
          }
        }
      }
    );
    this.astar.enableSync();
    // this.astar.disableDiagonals();
    // this.astar.enableCornerCutting();
    this.astar.enableDiagonals();
    this.astar.disableCornerCutting();
    this.astar.calculate();
    return points.length >= 1 ? new Path(points) : null;
  }

  /**
   * Tells the character to get to the given point in world coordinates (1
   * tile = 1.00 distance). Returns true if able to do that.
   */
  public directCharacterToPoint(char: Character, point: Phaser.Point): boolean {
    char.path = this.pathfind(char.getWorldPosition(), point);
    return char.path !== null;
  }

  public update(): void {
    this.updateCharacters();
  }

  private updateCharacters(): void {
    this.characters.forEach(char => {
      char.getSprite().body.setZeroVelocity();
    });
    this.characters.filter(char => char.path !== null).forEach(char => {
      const body = char.getSprite().body;
      const pos: Phaser.Point = new Phaser.Point(body.x / 64, body.y / 64);
      const path = char.path;
      let goalPoint: { x: number; y: number } | null = path!.currentGoal();
      if (goalPoint === null) {
        char.path = null;
        return;
      }
      if (path!.isNearGoal(pos)) {
        char.path!.advance();
        goalPoint = char.path!.currentGoal();
        if (goalPoint === null) {
          char.path = null;
          return;
        }
      }
      WorldState.moveCharacterTick(
        char,
        new Phaser.Point(goalPoint.x * 64, goalPoint.y * 64)
      );
    });
  }
}
