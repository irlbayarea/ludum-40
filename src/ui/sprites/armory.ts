import * as Phaser from 'phaser-ce';

import { SpriteFactory } from './factory';
import { assign, isNumber } from 'lodash';

/**
 * This class is tightly bound to the current tilesheet.
 */
export class Armory extends SpriteFactory {
  private static sheetWidth = 54;

  constructor(game: Phaser.Game) {
    super(game);
  }

  public peonSprite(
    x?: number,
    y?: number,
    options?: {
      skin?: SkinColor;
      hair?: HairColor | { color: HairColor; style: number } | null;
      beard?: HairColor | { color: HairColor; style: number } | null;
      lips?: boolean;
    }
  ): Phaser.Sprite {
    const sprite = this.game.add.sprite(x, y, this.peonTexture(options));
    sprite.scale = new Phaser.Point(4.0, 4.0);
    return sprite;
  }

  public peonTexture(options?: {
    skin?: SkinColor;
    hair?: HairColor | { color: HairColor; style: number } | null;
    beard?: HairColor | { color: HairColor; style: number } | null;
    lips?: boolean;
  }): Phaser.RenderTexture {
    options = assign(
      {
        skin: SkinColor.White,
        hair: null,
        beard: null,
        lips: false,
      },
      options
    );
    const parts = [this.body(options.skin as SkinColor, options.lips)];
    if (options.hair) {
      if (isNumber(options.hair)) {
        parts.push(this.hair(options.hair));
      } else {
        parts.push(this.hair(options.hair.color, options.hair.style));
      }
    }
    if (options.beard) {
      if (isNumber(options.beard)) {
        parts.push(this.beard(options.beard));
      } else {
        parts.push(this.beard(options.beard.color, options.beard.style));
      }
    }
    return this.flattenedAsTexture(parts, { width: 16, height: 16 });
  }

  /**
   * Returns the sprite for a body.
   *
   * @param color
   * @param lips
   */
  protected body(color: SkinColor, lips: boolean = false): Phaser.Sprite {
    const index = color * Armory.sheetWidth + (lips ? 1 : 0);
    return this.game.add.sprite(0, 0, 'characters', index);
  }

  /**
   * Returns the sprite for a specific hair style.
   *
   * @param style Index, numbers 0 -> 11, inclusive.
   */
  protected hair(color: HairColor, style: number = 0): any {
    let offset: number;
    switch (color) {
      case HairColor.Brown:
        offset = 19;
        break;
      case HairColor.Orange:
        offset = 23;
        break;
      case HairColor.Blonde:
        offset = 235;
        break;
      case HairColor.Black:
        offset = 239;
        break;
      case HairColor.White:
        offset = 451;
        break;
      default:
        throw new Error(`Unexpected color:HairColor = ${color}`);
    }
    const col = Math.floor(style / 4);
    const row = style % 4;
    const mod = row * Armory.sheetWidth;
    const index = mod + offset + col;
    return this.game.add.sprite(0, 0, 'characters', index);
  }

  /**
   * Returns the sprite for a specific beard style.
   *
   * @param style Index, numbers 0 -> 3, inclusive.
   */
  protected beard(color: HairColor, style: number = 0): any {
    return this.hair(color, style + 12);
  }
}

export enum SkinColor {
  White = 0,
  Tan = 1,
  Brown = 2,
  Green = 3,
}

export enum HairColor {
  Brown = 0,
  Orange = 1,
  Blonde = 2,
  Black = 3,
  White = 4,
}
