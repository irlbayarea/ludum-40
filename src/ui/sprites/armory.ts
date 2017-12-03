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
      shirt?: ShirtColor | { color: ShirtColor; style: number } | null;
      pants?: PantsColor;
      shield?: ShieldColor | { color: ShieldColor; style: number } | null;
      hat?: number;
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
    shirt?: ShirtColor | { color: ShirtColor; style: number } | null;
    pants?: PantsColor;
    shield?: ShieldColor | { color: ShieldColor; style: number } | null;
    hat?: number;
  }): Phaser.RenderTexture {
    options = assign(
      {
        skin: SkinColor.White,
        lips: false,
      },
      options
    );
    const parts = [this.body(options.skin as SkinColor, options.lips)];
    if ('shirt' in options) {
      if (isNumber(options.shirt)) {
        parts.push(this.shirt(options.shirt));
      } else {
        parts.push(this.shirt(options.shirt!.color, options.shirt!.style));
      }
    }
    if ('pants' in options) {
      parts.push(this.pants(options.pants as PantsColor));
    }
    if ('shield' in options) {
      if (isNumber(options.shield)) {
        parts.push(this.shield(options.shield));
      } else {
        parts.push(this.shield(options.shield!.color, options.shield!.style));
      }
    }
    if ('hair' in options) {
      if (isNumber(options.hair)) {
        parts.push(this.hair(options.hair));
      } else {
        parts.push(this.hair(options.hair!.color, options.hair!.style));
      }
    }
    if ('beard' in options) {
      if (isNumber(options.beard)) {
        parts.push(this.beard(options.beard));
      } else {
        parts.push(this.beard(options.beard!.color, options.beard!.style));
      }
    }
    if ('hat' in options) {
      parts.push(this.hat(options.hat));
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
   * Returns the sprite for a shirt.
   *
   * @param color
   * @param style
   */
  protected shirt(color: ShirtColor, style: number = 0): Phaser.Sprite {
    let offset: number;
    switch (color) {
      case ShirtColor.Orange:
        offset = 6;
        break;
      case ShirtColor.Teal:
        offset = 10;
        break;
      case ShirtColor.Purple:
        offset = 14;
        break;
      case ShirtColor.Green:
        offset = 276;
        break;
      case ShirtColor.Tan:
        offset = 280;
        break;
      case ShirtColor.Black:
        offset = 284;
        break;
      default:
        throw new Error(`Unexpected shirt:ShirtColor = ${color}`);
    }
    const index = this.point(offset, style);
    return this.game.add.sprite(0, 0, 'characters', index);
  }

  /**
   * Returns the sprite for a pair of shoes.
   *
   * @param color
   */
  protected pants(color: PantsColor): Phaser.Sprite {
    const index = 3 + color * Armory.sheetWidth;
    return this.game.add.sprite(0, 0, 'characters', index);
  }

  /**
   * Returns the sprite for a specific hair style.
   *
   * @param style Index, numbers 0 -> 11, inclusive.
   */
  protected hair(color: HairColor, style: number = 0): Phaser.Sprite {
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
    const index = this.point(offset, style);
    return this.game.add.sprite(0, 0, 'characters', index);
  }

  /**
   * Returns the sprite for a specific beard style.
   *
   * @param style Index, numbers 0 -> 3, inclusive.
   */
  protected beard(color: HairColor, style: number = 0): Phaser.Sprite {
    return this.hair(color, style + 12);
  }

  /**
   * Returns the sprite for a specific shield style.
   *
   * @param color
   * @param style
   */
  protected shield(color: ShieldColor, style: number = 0): Phaser.Sprite {
    let offset: number;
    switch (color) {
      case ShieldColor.Bronze:
        offset = 33;
        break;
      case ShieldColor.Silver:
        offset = 37;
        break;
      case ShieldColor.Gold:
        offset = 195;
        break;
      case ShieldColor.OrangeGreen:
        offset = 199;
        break;
      case ShieldColor.SilverTan:
        offset = 357;
        break;
      case ShieldColor.BronzeTeal:
        offset = 361;
        break;
      default:
        throw new Error(`Unexpected color:ShieldColor = ${color}`);
    }
    const index = this.point(offset, style);
    return this.game.add.sprite(0, 0, 'characters', index);
  }

  /**
   * Returns the sprite for a specific hat style.
   *
   * @param style
   */
  protected hat(style: number = 0): Phaser.Sprite {
    const index = this.point(28, style);
    return this.game.add.sprite(0, 0, 'characters', index);
  }

  /**
   * Returns the absolute offset in the tilset.
   *
   * @param offset
   * @param style
   * @param width
   */
  private point(offset: number, style: number, width: number = 4): number {
    const col = style % width;
    const row = Math.floor(style / width);
    const mod = row * Armory.sheetWidth;
    return mod + offset + col;
  }
}

export enum ShirtColor {
  Orange = 0,
  Teal = 1,
  Purple = 2,
  Green = 3,
  Tan = 4,
  Black = 5,
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

export enum PantsColor {
  Black = 0,
  Brown = 1,
  Silver = 2,
  Gold = 3,
  Orange = 5,
  Teal = 6,
  Purple = 7,
  Green = 8,
}

export enum ShieldColor {
  Bronze = 0,
  Silver = 1,
  Gold = 2,
  OrangeGreen = 3,
  SilverTan = 4,
  BronzeTeal = 5,
}
