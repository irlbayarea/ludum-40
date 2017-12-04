import * as Phaser from 'phaser-ce';

export default class BloodFactory {
  private game: Phaser.Game;

  constructor(game: Phaser.Game) {
    this.game = game;
  }

  public blood(on: Phaser.Sprite): Phaser.Sprite {
    const sprite = this.game.add.sprite(
      on.body.x - 48,
      on.body.y - 32,
      'blood'
    );
    sprite.scale = new Phaser.Point(0.25, 0.25);
    sprite.animations.add('animate');
    sprite.animations.play('animate', 30, false, true);
    return sprite;
  }

  public boom(on: Phaser.Sprite): Phaser.Sprite {
    const sprite = this.game.add.sprite(on.x, on.y, 'explode');
    // sprite.scale = new Phaser.Point(0.25, 0.25);
    sprite.animations.add('animate');
    sprite.animations.play('animate', 30, false, true);
    return sprite;
  }
}
