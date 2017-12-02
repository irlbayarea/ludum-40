import * as Phaser from 'phaser-ce';

/**
 * Main state (i.e. in the game).
 */
export default class Main extends Phaser.State {
  private cursors: Phaser.CursorKeys;

  public create(): void {
    const map = this.game.add.tilemap('Tilemap');
    map.addTilesetImage('tiles', 'tiles');

    const layer = map.createLayer('terrain');
    layer.resizeWorld();
    layer.wrap = true;
    this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  public init(): void {
    this.stage.backgroundColor = '#EDEEC9';
  }

  public update(): void {
    if (this.cursors.left.isDown) {
      this.game.camera.x -= 8;
    } else if (this.cursors.right.isDown) {
      this.game.camera.x += 8;
    }
    if (this.cursors.up.isDown) {
      this.game.camera.y -= 8;
    } else if (this.cursors.down.isDown) {
      this.game.camera.y += 8;
    }
  }
}
