import * as Phaser from 'phaser-ce';

/**
 * Boot state (loading the game).
 */
export default class Boot extends Phaser.State {
  public init(): void {
    this.stage.backgroundColor = '#000';
  }

  public preload(): void {
    this.load.spritesheet(
      'rpg',
      require('assets/sprites/rpg-sheet.png'),
      64,
      64,
      196
    );
    this.load.image('logo', require('assets/images/phaser.png'));
  }

  public render(): void {
    this.state.start('Main');
  }
}
