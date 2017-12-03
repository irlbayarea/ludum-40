import * as common from '../../common';
import * as Phaser from 'phaser-ce';
import Character from '../../character/character';

export class SpriteHUD {

  private nameTag: Phaser.Text;
  // private healthBar: Phaser.Sprite;

  constructor(private readonly character: Character) {
    this.addNameTag();
    // this.addHealthBar();
  }

  // private addHealthBar(): void {
  //   this.healthBar = this.character.getSprite().game.add.bitmapData(
  //     this.character.getSprite().width,
  //     this.character.getSprite().height*0.1
  //   );
  // 
  // }

  public updateHealthBar(): void {
    common.debug.log(
      this.character.getName() + " : " + 
      100*(this.character.getSprite().health / this.character.getSprite().maxHealth)
      + " % "
    );
  }

  private addNameTag(): void {
    this.nameTag = new Phaser.Text(
      this.character.getSprite().game,
      0,0,
      this.character.getName(), {
        boundsAlignH: 'left',
        boundsAlignV: 'bottom',
        align: 'left',
        fill: '#FFFFFF',
        wordWrap: true,
        wordWrapWidth:this. character.getSprite().width,
        font: 'bold 16px Arial'
    });
    this.nameTag.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 3);
    this.nameTag.setTextBounds(0, 0, 
      this.character.getSprite().width,
      this.character.getSprite().height);
      this.nameTag.anchor.set(this.character.getSprite().width / 4 / 32, 0);
    this.nameTag.scale.set(0.25, 0.25);
    this.character.getSprite().addChild(this.nameTag);
  }

}
