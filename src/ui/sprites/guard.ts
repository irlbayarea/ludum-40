import * as Phaser from 'phaser-ce';

/**
 * Efficiently creates `Phaser.Sprite` objects representing a "Hut".
 */
export default class GuardFactory {
  private game: Phaser.Game;
  private texture: Phaser.RenderTexture;

  constructor(game: Phaser.Game) {
    const texture = game.add.renderTexture(64, 128);

    const top = game.add.sprite(0, 0, 'guard', 126);

    // Render to texture.
    texture.renderXY(top, 0, 0);

    // Cleanup.
    top.kill();

    this.game = game;
    this.texture = texture;
  }

  public sprite(x?: number, y?: number): Phaser.Sprite {
    return this.game.add.sprite(x, y, this.texture);
  }
}
