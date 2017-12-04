// import * as common from '../../common';
import * as Phaser from 'phaser-ce';
import { game } from '../../index';
import * as Time from '../../logic/_time/common';

export class SpriteHUD {
  private static readonly charScale: number = 4;
  private static readonly bloodSprayThreshold: number = 0.25;
  private static readonly bloodSprayPeriodBase: number = 2.0;
  private static readonly bloodSprayPulseWidth: number = 0.1;

  private nameTag: Phaser.Text;
  private healthBar: Phaser.Sprite;

  constructor(
    private readonly sprite: Phaser.Sprite,
    private readonly name: string,
    private readonly lefthanded: boolean
  ) {}

  public sprayBlood(): void {
    if (this.healthPercent() < SpriteHUD.bloodSprayThreshold) {
      if (
        Math.abs(
          (Time.default.wallTime() % SpriteHUD.bloodSprayPeriodBase) *
            (this.healthPercent() / SpriteHUD.bloodSprayThreshold)
        ) < SpriteHUD.bloodSprayPulseWidth
      ) {
        game.blood.blood(this.sprite);
      }
    }
  }

  public updateHealthBar(): void {
    this.healthBar.tint = this.healthColorRange(this.healthPercent());
    this.healthBar.scale.set(this.healthPercent(), 1);
    // common.debug.log(this.name + ' : ' + 100 * this.healthPercent() + ' % ');
  }

  public addHealthBar(): void {
    if (this.healthBar === undefined) {
      const hbH = 1; // health bar height
      const bmd = this.sprite.game.add.bitmapData(
        this.sprite.width / SpriteHUD.charScale,
        hbH
      );
      bmd.ctx.beginPath();
      bmd.ctx.rect(0, 0, this.sprite.width * (this.lefthanded ? -1 : 1), hbH);
      bmd.ctx.fillStyle = '#FFF000';
      bmd.ctx.fill();

      this.healthBar = this.sprite.game.add.sprite(0, 9, bmd);
      this.healthBar.anchor.set(0.5, 0);
      this.healthBar.tint = this.healthColorRange(this.healthPercent());
      this.healthBar.scale.set(this.healthPercent(), 1);
      this.sprite.addChild(this.healthBar);
    } else {
      throw new Error('Sprite already has a health bar!');
    }
  }

  public addNameTag(): void {
    if (this.nameTag === undefined) {
      this.nameTag = new Phaser.Text(this.sprite.game, 0, 10.5, this.name, {
        boundsAlignH: 'left',
        boundsAlignV: 'top',
        align: 'center',
        fill: '#FFFFFF',
        wordWrap: true,
        wordWrapWidth: this.sprite.width,
        font: 'bold 16px Arial',
      });
      this.nameTag.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 3);
      this.nameTag.setTextBounds(0, 0, this.sprite.width, this.sprite.height);
      this.nameTag.anchor.set(0.5, 0);
      this.nameTag.scale.set(0.25);
      this.nameTag.scale.x *= this.lefthanded ? -1 : 1;
      this.sprite.addChild(this.nameTag);
    } else {
      throw new Error('Sprite already has name tag!');
    }
  }

  private healthColorRange(percent: number): number {
    return Phaser.Color.interpolateColor(
      0x52be80,
      0xff0000,
      100 - percent * 100,
      100
    );
  }

  private healthPercent(): number {
    // common.debug.log(
    //   'Health % : ' +
    //     this.name +
    //     ' : ' +
    //     this.sprite.health +
    //     '/' +
    //     this.sprite.maxHealth
    // );
    return this.sprite.health / this.sprite.maxHealth;
  }
}
