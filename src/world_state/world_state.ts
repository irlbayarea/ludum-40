import * as Phaser from 'phaser-ce';
import * as EasyStar from 'easystarjs';

import Grid from './grid';
import Path from './path';

import Character from '../character/character';
import Player from '../character/player';

/**
 */
export default class WorldState {
  public readonly grid: Grid;

  private readonly astar: EasyStar.js;

  private guards: Character[];
  private player: Player;

  public constructor(gridw: number, gridh: number) {
    this.grid = new Grid(gridw, gridh);
    this.astar = new EasyStar.js();
    this.astar.setGrid(this.grid.collisions);
  }

  public pathfind(from: Phaser.Point, to: Phaser.Point): Path {
    return new Path([from, to]);
  }

  public setPlayer(player: Player) {
    if (this.player === undefined) {
      this.player = player;
    } else {
      throw new Error('Player already defined');
    }
  }

  public addGuard(guard: Character): void {
    this.guards.push(guard);
  }

  public getPlayer(): Player {
    return this.player;
  }
}
