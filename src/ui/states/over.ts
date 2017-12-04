import * as Phaser from 'phaser-ce';
import { game } from '../../index';

/**
 * Death State.
 */
export default class GameOver extends Phaser.State {
  private rKey: Phaser.Key;

  public init(): void {
    this.stage.backgroundColor = '#FF0000';
    this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
  }

  public update(): void {
    if (this.rKey.isDown) {
      game.worldState.resetKillCounts();
      this.state.start('Main');
    }
  }
}
