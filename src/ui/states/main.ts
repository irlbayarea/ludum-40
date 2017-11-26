import * as Phaser from 'phaser-ce';

/**
 * Main state (i.e. in the game).
 */
export default class Main extends Phaser.State {
  public create(): void {
    const logo = new Phaser.Sprite(
      this.game,
      this.world.centerX - 382 / 2,
      this.world.centerY - 320 / 2,
      'logo'
    );

    this.game.add.existing(logo);
  }

  public preload(): void {
    // TODO: Extract to a previous state/loader.
    // tslint:disable-next-line:no-submodule-imports
    this.load.image('logo', require('assets/images/phaser.png'));
  }
}
