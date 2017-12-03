import * as Phaser from 'phaser-ce';
import * as common from '../../common';
import { game } from '../../index';

export class Weapon {
  public static sword(): Weapon {
    return new Weapon(368);
  }

  public static dagger(): Weapon {
    return new Weapon(422);
  }

  public static scimitar(): Weapon {
    return new Weapon(476);
  }

  public static axe(): Weapon {
    return new Weapon(101);
  }

  public static spear(): Weapon {
    return new Weapon(49);
  }

  public readonly range: number;

  private readonly sprite: Phaser.Sprite;
  private mIsSwinging: boolean;
  private mIsHitting: boolean;
  private swingTimer?: Phaser.TimerEvent;

  private constructor(style: number = 368, options?: { range: number }) {
    this.sprite = game.make.sprite(-6, 4, 'characters', style);
    this.range =
      (options && options.range) || common.globals.gameplay.defaultWeaponRange;
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
      this.swingTimer = game.time.events.add(150, () => {
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

  private reset(): void {
    this.sprite.rotation = 0;
    this.mIsSwinging = false;
  }

  get isSwinging(): boolean {
    return this.mIsSwinging;
  }
}
