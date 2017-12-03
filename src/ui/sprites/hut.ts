import * as Phaser from 'phaser-ce';

import {SpriteFactory} from './factory';

/**
 * Efficiently creates `Phaser.Sprite` objects representing a "Hut".
 */
export default class HutFactory extends SpriteFactory {
  private readonly texture: Phaser.RenderTexture;

  constructor(game: Phaser.Game) {
    super(game);
    this.texture = this.flattenedAsTexture([
      game.add.sprite(0, 0, 'tiles', 126),
      game.add.sprite(0, 0, 'tiles', 124),
      game.add.sprite(0, 0, 'tiles', 214),
    ], {
      cleanup: true,
      offsets: [
        {x: 0, y: 0},
        {x: 0, y: 64},
        {x: 0, y: 64},
      ],
      width: 64,
      height: 128,
    });
  }

  public sprite(x?: number, y?: number): Phaser.Sprite {
    return this.game.add.sprite(x, y, this.texture);
  }
}
