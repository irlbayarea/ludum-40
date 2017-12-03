import * as Phaser from 'phaser-ce';

/**
 * Death State.
 */
export default class GameOver extends Phaser.State {
  public init(): void {
    this.stage.backgroundColor = '#FF0000';
  }
}
