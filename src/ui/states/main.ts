import * as Phaser from 'phaser-ce';

/**
 * Main state (i.e. in the game).
 */
export default class Main extends Phaser.State {
  private cursors: Phaser.CursorKeys;
  private character: Phaser.Sprite;

  public create(): void {
    const map = this.game.add.tilemap('Tilemap');
    map.addTilesetImage('tiles', 'tiles');
    const layers = [
      map.createLayer('terrain'),
      map.createLayer('foreground'),
      map.createLayer('structures'),
    ];
    layers.forEach(layer => {
      layer.resizeWorld();
      layer.wrap = true;
    });
    this.cursors = this.game.input.keyboard.createCursorKeys();

    // Example of the main character.
    this.character = this.game.add.sprite(0, 64 * 4, 'characters', 325);
    this.character.scale = new Phaser.Point(4.0, 4.0);
  }

  public update(): void {
    this.game.camera.follow(this.character);
    if (this.cursors.left.isDown) {
      this.character.x -= 8;
    } else if (this.cursors.right.isDown) {
      this.character.x += 8;
    }
    if (this.cursors.up.isDown) {
      this.character.y -= 8;
    } else if (this.cursors.down.isDown) {
      this.character.y += 8;
    }
  }
}
