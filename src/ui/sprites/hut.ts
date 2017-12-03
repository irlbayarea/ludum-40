import * as Phaser from 'phaser-ce';

import { SpriteFactory } from './factory';

/**
 * Efficiently creates `Phaser.Sprite` objects representing a "Hut".
 */
export default class HutFactory extends SpriteFactory {
  private readonly denTexture: Phaser.RenderTexture;
  private readonly hutTexture: Phaser.RenderTexture;

  constructor(game: Phaser.Game) {
    super(game);
    this.hutTexture = this.flattenedAsTexture(
      [
        game.add.sprite(0, 0, 'tiles', 126),
        game.add.sprite(0, 0, 'tiles', 124),
        game.add.sprite(0, 0, 'tiles', 214),
      ],
      {
        cleanup: true,
        offsets: [{ x: 0, y: 0 }, { x: 0, y: 64 }, { x: 0, y: 64 }],
        width: 64,
        height: 128,
      }
    );
    this.denTexture = this.flattenedAsTexture(
      [
        game.add.sprite(0, 0, 'tiles', 135),
        game.add.sprite(0, 0, 'tiles', 133),
        game.add.sprite(0, 0, 'tiles', 194),
      ],
      {
        cleanup: true,
        offsets: [{ x: 0, y: 0 }, { x: 0, y: 64 }, { x: 0, y: 64 }],
        width: 64,
        height: 128,
      }
    );
  }

  public hut(x?: number, y?: number): Phaser.Sprite {
    return this.game.add.sprite(x, y, this.hutTexture);
  }

  public den(x?: number, y?: number): Phaser.Sprite {
    return this.game.add.sprite(x, y, this.denTexture);
  }
}
