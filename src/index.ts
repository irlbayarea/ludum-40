import * as Phaser from 'phaser-ce';

class Game extends Phaser.Game {
  constructor(config: Phaser.IGameConfig) {
    super(config);

    this.state.add('Main', Main);
    this.state.start('Main');
  }
}

class Main extends Phaser.State {
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
    this.load.image('logo', require('assets/images/phaser.png'));
  }
}

new Game({});
