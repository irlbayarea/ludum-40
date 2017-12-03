import * as Phaser from 'phaser-ce';
import { filter, sample } from 'lodash';
import { ITicker } from '../ticker';
import PeriodicGenerator from '../periodic_generator';
import * as common from '../common';
import HutFactory from '../ui/sprites/hut';
import { game } from '../index';

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

  private readonly hutGenerator: HutGenerator;
  private readonly hutSpawnActive: Map<
    Phaser.Tile,
    Hut | undefined
  > = new Map();
  private readonly hutSpawnLocations: Phaser.Tile[];

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
      this.hutGenerator = new HutGenerator(this, 1000, new HutFactory(game));
      game.generators.push(this.hutGenerator);
      common.debug.log('Hut spawn locations: ', this.hutSpawnActive.size);
    }

    const denLayer: Phaser.TilemapLayer = map.layers[map.getLayer('spawns')];
    if (denLayer) {
      this.denSpawnLocations = this.findSpawnLocations(denLayer);
      for (const result of this.denSpawnLocations) {
        this.denSpawnActive.set(result, undefined);
      }
      this.denGenerator = new DenGenerator(this, 1000, new HutFactory(game));
      game.generators.push(this.denGenerator);
      common.debug.log('Den spawn locations: ', this.denSpawnActive.size);
    }
  }

  /**
   * Given a den, spawn it into the world.
   *
   * @param den
   */
  public spawnDenIntoWorld(den: Den): void {
    const location = this.getDenSpawnLocation();
    if (location === undefined) {
      den.sprite.kill();
      common.debug.log('Tried to spawn a den, but no locations idle.');
      return;
    }
    common.debug.log('Spawning a den at', location);
    this.hutSpawnActive.set(location, den);
    den.sprite.x = location.x * 64;
    den.sprite.y = location.y * 64;
  }

  /**
   * Given a hut, spawn it into the world.
   *
   * @param hut
   */
  public spawnHutIntoWorld(hut: Hut): void {
    const location = this.getHutSpawnLocation();
    if (location === undefined) {
      hut.sprite.kill();
      common.debug.log('Tried to spawn a hut, but no locations idle.');
      return;
    }
    common.debug.log('Spawning a hut at', location);
    this.hutSpawnActive.set(location, hut);
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
}

export class Hut {
  constructor(public readonly sprite: Phaser.Sprite) {}
}

export class HutGenerator implements ITicker {
  private periodicGenerator: PeriodicGenerator<Hut>;

  public constructor(
    private readonly mechanics: GameMechanics,
    period: number,
    factory: HutFactory
  ) {
    this.periodicGenerator = new PeriodicGenerator<Hut>(
      period,
      (_: number) => new Hut(factory.hut())
    );
  }

  public tick(elapsed: number) {
    this.periodicGenerator.tick(elapsed).forEach(hut => {
      this.mechanics.spawnHutIntoWorld(hut);
    });
  }
}

export class Den {
  constructor(public readonly sprite: Phaser.Sprite) {}
}

export class DenGenerator implements ITicker {
  private periodicGenerator: PeriodicGenerator<Den>;

  public constructor(
    private readonly mechanics: GameMechanics,
    period: number,
    factory: HutFactory
  ) {
    this.periodicGenerator = new PeriodicGenerator<Den>(
      period,
      (_: number) => new Den(factory.den())
    );
  }

  public tick(elapsed: number) {
    this.periodicGenerator.tick(elapsed).forEach(hut => {
      this.mechanics.spawnDenIntoWorld(hut);
    });
  }
}
