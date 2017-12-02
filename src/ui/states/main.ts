import * as Phaser from 'phaser-ce';

/**
 * Main state (i.e. in the game).
 */
export default class Main extends Phaser.State {
  public create(): void {
    this.game.add.sprite(0, 0, 'rpg', 180);
  }

  public init(): void {
    this.stage.backgroundColor = '#EDEEC9';
  }
}
