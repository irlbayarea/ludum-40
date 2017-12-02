import * as Phaser from 'phaser-ce';
import * as EasyStar from 'easystarjs';

import Grid from './grid';
import Path from './path';

/**
 */
export default class WorldState {
  public readonly grid: Grid;

  private readonly astar: EasyStar.js;

  public constructor(gridw: number, gridh: number) {
    this.grid = new Grid(gridw, gridh);
    this.astar = new EasyStar.js();
    this.astar.setGrid(this.grid.)
  }
  
  public pathfind(from: Phaser.Point, to: Phaser.Point): Path {
    const path: Path = new Path();
  }
}
