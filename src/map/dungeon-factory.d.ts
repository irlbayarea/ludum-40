declare module 'dungeon-factory' {
  /**
   * Generates a 2-dimensional dungeon object suitable for map genreation.
   * 
   * See https://www.npmjs.com/package/dungeon-factory.
   * 
   * @param options Width and height, which must be odd-numbers.
   */
  export function generate(options: {height: number, width: number}): IDungeon;

  /**
   * Rooms (regions) and tiles generated.
   */
  interface IDungeon {
    readonly rooms: IRoom[]
    readonly tiles: ITile[]
  }

  interface IRoom {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  }

  interface IDirections {
    readonly north: ITile;
    readonly east: ITile;
    readonly south: ITile;
    readonly west: ITile;
  }

  interface ITile {
    readonly neighbors: ITile[];
    readonly type: ITileType;
    readonly nesw: IDirections;
    readonly region: number;
  }

  enum ITileType {
    Wall = 'wall',
    Floor = 'floor',
    Door = 'door',
  }
}
