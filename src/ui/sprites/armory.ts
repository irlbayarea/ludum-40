import * as Phaser from 'phaser-ce';

import { SpriteFactory } from './factory';

/**
 * This class is tightly bound to the current tilesheet.
 */
export class Armory extends SpriteFactory {
  constructor(game: Phaser.Game) {
    super(game);
  }

  /**
   * Returns the sprite for a body.
   *
   * @param color 
   * @param lips 
   */
  protected body(color: SkinColor, lips?: boolean = false) {
    return null;
  }

  /**
   * Returns the sprite for a specific hair style.
   *
   * @param style Index, numbers 0 -> 11, inclusive.
   */
  protected hair(color: HairAndBeardColor, style: number) : any {
    return null;
  }

  /**
   * Returns the sprite for a specific beard style.
   * 
   * @param style Index, numbers 0 -> 3, inclusive.
   */
  protected beard(color: HairAndBeardColor, style: number) : any {
    return null;
  }
}

enum SkinColor {
  White = 1,
  Tan = 2,
  Brown = 3,
  Green = 4,
}

enum HairAndBeardColor {
  Brown = 0,
  Orange = 1,
  Blonde = 2,
  Black = 3,
  White = 4,
}
