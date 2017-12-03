import { RenderTexture } from 'phaser-ce';
import Character from './character';
import Grid from '../world_state/grid';

export class SpawnConfig {
  public constructor(
    public readonly character: Character,
    public readonly texture: RenderTexture,
    public readonly x: number,
    public readonly y: number
  ) {}
}

export function randomSpawnLocation(grid: Grid): { x: number; y: number } {
  const spawnOptions = grid.getEmptyCells();
  return spawnOptions[Math.floor(Math.random() * spawnOptions.length)];
}
