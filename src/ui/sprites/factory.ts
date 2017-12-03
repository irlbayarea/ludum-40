import * as Phaser from 'phaser-ce';
import { first } from 'lodash';

/**
 * Helper class for generating [Phaser.Sprite]s at runtime.
 */
export class SpriteFactory {
  constructor(protected readonly game: Phaser.Game) {}

  /**
   * Returns a sprite from any sprites, flattened.
   *
   * @param sprites
   * @param options
   */
  protected flattenedAsTexture(
    sprites: Phaser.Sprite[],
    options?: {
      cleanup?: boolean;
      width?: number;
      height?: number;
      offsets?: Array<{ x: number; y: number }>;
    }
  ): Phaser.RenderTexture {
    const sprite = first(sprites);
    const width = options ? options.width : sprite!.width;
    const height = options ? options.height : sprite!.height;
    const offsets = options ? options.offsets : undefined;
    const cleanup = options ? options.cleanup !== false : true;
    const texture = this.game.add.renderTexture(width, height);
    if (offsets) {
      for (let i = 0; i < sprites.length; i++) {
        const layer = sprites[i];
        const offset = offsets[i];
        texture.renderXY(layer, offset.x, offset.y);
        if (cleanup) {
          layer.kill();
        }
      }
    } else {
      for (const layer of sprites) {
        texture.render(layer);
        if (cleanup) {
          layer.kill();
        }
      }
    }
    return texture;
  }
}
