import * as Phaser from 'phaser-ce';

/**
 * Efficiently creates `Phaser.Sprite` objects representing a "Hut".
 */
export default class GuardFactory {
  private game: Phaser.Game;
  private texture: Phaser.RenderTexture;

  constructor(game: Phaser.Game, guardName: string) {
    const texture = game.add.renderTexture(64, 64);

    const guardSprite = game.add.sprite(0, 0, 'guard_' + guardName, 126);

    // Render to texture.
    texture.renderXY(guardSprite, 0, 0);

    // Cleanup.
    guardSprite.kill();

    this.game = game;
    this.texture = texture;
  }

  public sprite(x?: number, y?: number): Phaser.Sprite {
    return this.game.add.sprite(x, y, this.texture);
  }
}
