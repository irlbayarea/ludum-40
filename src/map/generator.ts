import * as DungeonFactory from 'dungeon-factory';
import * as Phaser from 'phaser-ce';

/**
 * Helper method for invoking map generation.
 *
 * @param width
 * @param height
 */
export function generateMap(
  width: number,
  height: number
): DungeonFactory.IDungeon {
  const map = DungeonFactory.generate({ width, height });
  (map as any).widget = width;
  (map as any).height = height;
  return map as IMap;
}

interface IMap extends DungeonFactory.IDungeon {
  readonly width: number;
  readonly height: number;
}

/**
 * Converts a generated map into a tilemap.
 *
 * @param map
 * @param game 
 */
export function convertToTiles(map: IMap, game: Phaser.Game): Phaser.Tilemap {
  return game.add.tilemap(undefined, 64, 64, map.width, map.height);
}
