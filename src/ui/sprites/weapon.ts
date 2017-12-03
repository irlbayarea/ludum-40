import * as Phaser from 'phaser-ce';

export class Weapon {
  private readonly sprite: Phaser.Sprite;
  private last: number;

  constructor(private readonly game: Phaser.Game) {
    this.sprite = game.make.sprite(-6, 4, 'characters', 368);
  }

  public attach(sprite: Phaser.Sprite): void {
    sprite.addChild(this.sprite);
    this.sprite.pivot.x = this.sprite.width * 0.1;
    this.sprite.pivot.y = this.sprite.height * 0.8;
    this.sprite.anchor.set(0, 0);
  }

  public update(attack: boolean): void {
    if (attack) {
      this.sprite.rotation -= 0.25;
      this.last = this.game.time.now;
    } else if (this.sprite.rotation !== 0) {
      if (this.game.time.elapsedSince(this.last) > 150) {
        this.sprite.rotation = 0;
      }
    }
  }
}
