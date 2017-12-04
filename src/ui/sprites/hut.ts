import * as Phaser from 'phaser-ce';

import { SpriteFactory } from './factory';
import * as common from '../../common';

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

  public hut(): Phaser.Sprite {
    const hut = this.game.add.sprite(undefined, undefined, this.hutTexture);
    hut.health = hut.maxHealth = common.globals.gameplay.denAndHutHP;
    return hut;
  }

  public den(): Phaser.Sprite {
    const den = this.game.add.sprite(undefined, undefined, this.denTexture);
    den.health = den.maxHealth = common.globals.gameplay.denAndHutHP;
    return den;
  }
}
