import * as Phaser from 'phaser-ce';

export default class BloodFactory {
    private game: Phaser.Game;
  
    constructor(game: Phaser.Game) {
      this.game = game;
    }

    public sprite(on: Phaser.Sprite): Phaser.Sprite {
      const sprite = this.game.add.sprite(on.body.x, on.body.y, 'blood',);
      sprite.scale = new Phaser.Point(0.25, 0.25);
      sprite.animations.add('animate');
      sprite.animations.play('animate', 30, false, true);
      return sprite;
    }
}
