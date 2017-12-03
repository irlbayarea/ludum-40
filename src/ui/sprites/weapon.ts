import * as Phaser from 'phaser-ce';

export class Weapon {
  private readonly sprite: Phaser.Sprite;

  private mIsSwinging: boolean;
  private mIsHitting: boolean;
  private swingTimer?: Phaser.TimerEvent;

  constructor(private readonly game: Phaser.Game) {
    this.sprite = game.make.sprite(-6, 4, 'characters', 368);
  }

  public attach(sprite: Phaser.Sprite): void {
    sprite.addChild(this.sprite);
    this.sprite.pivot.x = this.sprite.width * 0.1;
    this.sprite.pivot.y = this.sprite.height * 0.8;
    this.sprite.anchor.set(0, 0);
  }

  public detach(sprite: Phaser.Sprite): void {
    sprite.removeChild(this.sprite);
  }

  public markInUse(): void {
    this.mIsSwinging = true;
    if (!this.swingTimer) {
      this.swingTimer = this.game.time.events.add(150, () => {
        this.reset();
        this.swingTimer = undefined;
        this.mIsHitting = true;
      });
    }
  }

  public update(): void {
    if (this.isSwinging) {
      this.sprite.rotation -= 0.25;
    }
    this.mIsHitting = false;
  }

  get isHitting(): boolean {
    return this.mIsHitting;
  }

  get isSwinging(): boolean {
    return this.mIsSwinging;
  }

  private reset(): void {
    this.sprite.rotation = 0;
    this.mIsSwinging = false;
  }
}
