import * as Phaser from 'phaser-ce';

/**
 * Efficiently creates `Phaser.Sprite` objects representing a "Hut".
 */
export default class HutFactory {
  private game: Phaser.Game;
  private texture: Phaser.RenderTexture;

  constructor(game: Phaser.Game) {
    const texture = game.add.renderTexture(64, 128);

    const top = game.add.sprite(0, 0, 'tiles', 126);
    const bottom = game.add.sprite(0, 0, 'tiles', 124);
    const door = game.add.sprite(0, 0, 'tiles', 214);

    // Render to texture.
    texture.renderXY(top, 0, 0);
    texture.renderXY(bottom, 0, 64);
    texture.renderXY(door, 0, 64);

    // Cleanup.
    top.kill();
    bottom.kill();
    door.kill();

    this.game = game;
    this.texture = texture;
  }

  public sprite(x?: number, y?: number): Phaser.Sprite {
    return this.game.add.sprite(x, y, this.texture);
  }
}
