import * as common from '../../common';
import * as Phaser from 'phaser-ce';
import Character from '../../character/character';

export class SpriteHUD {
  private nameTag: Phaser.Text;
  private healthBar: Phaser.Sprite;

  private static readonly charScale: number = 4;

  constructor(private readonly character: Character) {
    this.addHealthBar();
    this.addNameTag();
  }

  private addHealthBar(): void {
    const hbH = 1; // health bar height
    const bmd = this.character.getSprite().game.add.bitmapData(
      this.character.getSprite().width / SpriteHUD.charScale,
      hbH);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 
      this.character.getSprite().width, hbH);
    bmd.ctx.fillStyle = "#FFF000";
    bmd.ctx.fill();

    this.healthBar = this.character.getSprite().game.add.sprite(
      0, 9, bmd);
    this.healthBar.anchor.set(0.5, 0);
    this.healthBar.tint = this.healthColorRange(1);
    this.healthBar.scale.set(1, 1);    
    this.character.getSprite().addChild(this.healthBar);
  }

  private healthPercent(): number {
    return this.character.getSprite().health / this.character.getSprite().maxHealth;
  }

  public updateHealthBar(): void {
    this.healthBar.tint =this.healthColorRange(this.healthPercent());
    this.healthBar.scale.set(this.healthPercent(), 1);
    common.debug.log(
      this.character.getName() +
        ' : ' + 100 *this.healthPercent() + ' % '
    );
  }

  private healthColorRange(percent: number): number {
    if (percent >= 1.0) {
      return 0x52BE80; //Green
    } else if (1.0 > percent && percent >= 0.5 ) {
      return 0xD35400; //Orange
    } else if (0.5 > percent && percent >= 0.25) {
      return 0xC0392B; //Orange-Red
    } else {
      return 0xFF0000;
    }
  }


  private addNameTag(): void {
    this.nameTag = new Phaser.Text(
      this.character.getSprite().game,
      0, 10.5,
      this.character.getName(),
      {
        boundsAlignH: 'left',
        boundsAlignV: 'top',
        align: 'center',
        fill: '#FFFFFF',
        wordWrap: true,
        wordWrapWidth: this.character.getSprite().width,
        font: 'bold 16px Arial',
      }
    );
    this.nameTag.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 3);
    this.nameTag.setTextBounds(
      0, 0,
      this.character.getSprite().width,
      this.character.getSprite().height
    );
    this.nameTag.anchor.set(0.5, 0);
    this.nameTag.scale.set(0.25);
    this.character.getSprite().addChild(this.nameTag);
  }
}
