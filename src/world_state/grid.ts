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
  
  public getEmptyCells(): Array<{x:number, y:number}> {
    const arr: Array<{x:number, y:number}> = [];
    for (let x = 0; x < this.w; x++) {
      for (let y = 0; y < this.h; y++ ) {
        if (this.collisions[x][y] == 1)
          arr.push({x:x, y:y});
      }
    }
    return arr;
  }
}
