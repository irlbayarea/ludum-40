import * as DungeonFactory from 'dungeon-factory';

/**
 * Helper method for invoking map generation.
 *
 * @param width
 * @param height 
 */
export default function generateMap(width: number, height: number): DungeonFactory.IDungeon {
  return DungeonFactory.generate({width, height});
}
