import Cell from './cell';

/**
 * Represents a world grid of Cell objects.
 */
export default class Grid {
  public readonly cells: Cell[];
  public readonly collisions: number[][]; // Need for pathfinding.
  public readonly w: number;
  public readonly h: number;

  public constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.cells = [];
    this.collisions = [];
    for (let x: number = 0; x < w; x++) {
      this.collisions[x] = [];
      for (let y: number = 0; y < h; y++) {
        this.cells[x + y * w] = new Cell();
        this.collisions[x][y] = 0;
      }
    }
  }

  public cell(x: number, y: number): Cell {
    return this.cells[x + y * this.w];
  }

  /**
   * Returns whether the cell at the given location is blocking.
   */
  public collision(x: number, y: number): boolean {
    return this.collisions[x][y] === 1;
  }

  /**
   * Returns whether the given position (in world coordinates, 1 tile = 1.00) is blocked.
   * Returns true when the point is outside the grid.
   */
  public collisionWorldPoint(p: Phaser.Point): boolean {
    if (p.x < 0. || p.y < 0. || p.x >= this.w || p.y >= this.h)
      return true;
    return this.collisions[Math.floor(p.x)][Math.floor(p.y)] === 1;
  }

  public getEmptyCells(): Array<{ x: number; y: number }> {
    const arr: Array<{ x: number; y: number }> = [];
    for (let xx = 0; xx < this.w; xx++) {
      for (let yy = 0; yy < this.h; yy++) {
        if (this.collisions[xx][yy] === 1) {
          arr.push({ x: xx, y: yy });
        }
      }
    }
    return arr;
  }
}
