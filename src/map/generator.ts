import * as DungeonFactory from 'dungeon-factory';
import * as Phaser from 'phaser-ce';

/**
 * Helper method for invoking map generation.
 *
 * @param width
 * @param height
 */
export function generateMap(width: number, height: number): IMap {
  const map = DungeonFactory.generate({ width, height });
  (map as any).width = width;
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
export function convertToTiles(
  map: IMap,
  game: Phaser.Game,
  tileset: string
): Phaser.Tilemap {
  // Convert map to a CSV format.
  const csv = createCsv(
    map,
    {
      wall: 31,
      floor: 21,
    },
    26
  );

  game.cache.addTilemap('dynamic', null as any, csv, Phaser.Tilemap.CSV);
  const tilemap = game.add.tilemap('dynamic', 64, 64, map.width, map.height);
  tilemap.addTilesetImage(tileset, tileset, 64, 64);

  const layout = tilemap.createLayer(0);
  layout.resizeWorld();
  tilemap.setCollisionBetween(31, 31, true, layout);
  game.physics.p2.convertTilemap(tilemap, layout, true, true);

  return tilemap;
}

function createCsv(
  map: IMap,
  mapping: { [key: string]: number },
  defaultMapping: number = 0
): string {
  const data: string[] = [];
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const tile = map.tiles[y][x];
      data.push(`${mapping[tile.type] || defaultMapping}`);
      data.push(',');
    }
    data.push('\n');
  }
  return data.join('');
}
