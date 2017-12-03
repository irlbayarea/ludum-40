import Cell from './cell';

/**
 * Represents a world grid of Cell objects.
 */
export default class Grid {
  public readonly cells: Cell[];
  public readonly collisions: number[][]; // Need for pathfinding.

  public constructor(public readonly w: number, public readonly h: number) {
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
}
