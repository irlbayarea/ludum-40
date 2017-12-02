import * as Phaser from 'phaser-ce';

/**
 * Main state (i.e. in the game).
 */
export default class Main extends Phaser.State {
  public create(): void {
    const map = this.game.add.tilemap('Tilemap');
    map.addTilesetImage('tiles', 'tiles');

    const layer = map.createLayer('terrain');
    layer.resizeWorld();
    layer.wrap = true;
  }

  public init(): void {
    this.stage.backgroundColor = '#EDEEC9';
  }
}
