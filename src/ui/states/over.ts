import * as Phaser from 'phaser-ce';
import { game } from '../../index';

/**
 * Death State.
 */
export default class GameOver extends Phaser.State {
  private rKey: Phaser.Key;

  public init(message: string): void {
    const x = 0;
    const y = this.game.height / 2;
    const text = this.game.add.text(x, y, '', {
      font: 'bold ' + '30' + 'px ' + 'Arial',
      fill: '#FFFFFF',
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
    });
    text.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 3, true, true);
    text.align = 'center';
    text.fixedToCamera = true;
    text.text = message;
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
