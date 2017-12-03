import * as Phaser from 'phaser-ce';
import Controller from '../input/controller';
import {debug} from '../common';

export default class MessagePanel extends Phaser.Plugin {
  private controller: Controller;

  private text: Phaser.Text;

  private hudYSpeed: number = 0;

  private panelSprite: Phaser.Sprite;
  private oSprite: Phaser.Sprite;
  private optionList: Phaser.Text[] = [];
  private callback: (option: number) => void;

  constructor(game: Phaser.Game, manager: Phaser.PluginManager) {
    super(game, manager);
  }

  public init(group: Phaser.Group, controller: Controller): void {
    this.controller = controller;

    const game = this.game;
    const bitmap = game.add.bitmapData(game.width, game.height);

    const gr = 0.5 * (1 + Math.sqrt(5));
    const mainPanel = new Phaser.Rectangle(
      0,
      game.height * (1 - 1 / gr ** 3),
      game.width,
      game.height * (1 / gr ** 3)
    );

    bitmap.ctx.beginPath();
    bitmap.ctx.globalAlpha = 1/gr;
    bitmap.ctx.rect(
      mainPanel.x,
      mainPanel.y,
      mainPanel.width,
      mainPanel.height
    );
    bitmap.ctx.fillStyle = '#333333';
    bitmap.ctx.fill();

    this.panelSprite = game.add.sprite(0, 0, bitmap);
    this.panelSprite.fixedToCamera = true;
    this.panelSprite.physicsEnabled = true;
    group.add(this.panelSprite);

    const textPadX = mainPanel.width / gr ** 8;
    const textPadY = mainPanel.height / gr ** 4;
    const numLines = 4;

    const mainTextPanel = new Phaser.Rectangle(
      mainPanel.x + textPadX,
      mainPanel.y + textPadY,
      mainPanel.width / gr ** gr - 2 * textPadX,
      mainPanel.height - 2 * textPadY
    );

    const text = game.add.text(0, 0, '...', {
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
      align: 'center',
      fill: '#FFF',
      wordWrap: true,
      wordWrapWidth: mainTextPanel.width,
      font: 'bold ' + mainTextPanel.height / numLines + 'px Consolas',
    });
    text.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
    text.setTextBounds(
      mainTextPanel.x,
      mainTextPanel.y,
      mainTextPanel.width,
      mainTextPanel.height
    );
    text.fixedToCamera = true;
    group.add(text);

    this.text = text;

    const options = game.add.bitmapData(game.width, game.height);

    const choicePanel = new Phaser.Rectangle(
      mainTextPanel.x + mainTextPanel.width + 2 * textPadX,
      mainTextPanel.y,
      mainPanel.width - mainTextPanel.width - 4 * textPadX,
      mainTextPanel.height
    );

    options.ctx.beginPath();
    options.ctx.rect(
      choicePanel.x,
      choicePanel.y,
      choicePanel.width,
      choicePanel.height
    );
    options.ctx.fillStyle = '#787C8B';
    options.ctx.fill();
    options.ctx.strokeStyle = '#565869';
    options.ctx.strokeRect(
      choicePanel.x,
      choicePanel.y,
      choicePanel.width,
      choicePanel.height
    );
    this.oSprite = game.add.sprite(0, 0, options);
    this.oSprite.fixedToCamera = true;
    this.oSprite.visible = true;
    group.add(this.oSprite);

    for (let i = 0; i < 4; i++) {
      const choicePanelOption: Phaser.Rectangle = new Phaser.Rectangle(
        choicePanel.x +
          textPadX +
          choicePanel.width / 2 * (i === 0 || i === 2 ? 0 : 1),
        choicePanel.y +
          textPadY * (2 / 3) +
          choicePanel.height / 2 * (i === 0 || i === 1 ? 0 : 1),
        choicePanel.width / 2,
        choicePanel.height / 2
      );
      this.optionList.push(
        game.add.text(0, 0, '[ ]', {
          fill: '#FFFFFF',
          font: (choicePanel.height - 2 * textPadY) / 4 + 'px Consolas',
          wordWrap: true,
          wordWrapWidth: choicePanel.width / 2 - textPadX,
        })
      );
      this.optionList[i].setTextBounds(
        choicePanelOption.x,
        choicePanelOption.y,
        choicePanelOption.width,
        choicePanelOption.height
      );
      group.add(this.optionList[i]);
      this.optionList[i].visible = true;
      this.optionList[i].fixedToCamera = true;
    }
  }

  public askUser(
    optionListInput: string[],
    callback: (option: number) => void
  ): void {
    this.oSprite.visible = true;
    this.callback = callback;
    for (let i = 0; i < optionListInput.length; i++) {
      this.optionList[i].text = `[ ${i + 1} ] ${optionListInput[i]}`;
      this.optionList[i].visible = true;
    }
  }

  public setText(message: string): void {
    this.text.text = message;
  }

  public moveUpDown(): void {
    this.game.camera.y += 4;
    // this.oSprite.cameraOffset.y += this.hudYSpeed;
    // this.panelSprite.cameraOffset.y += this.hudYSpeed;
    // for (let i = 0; i < this.optionList.length; i++) {
    //   this.optionList[i].cameraOffset.y += this.hudYSpeed;
    // }
  }

  public setCameraFixed(cameraFixed: boolean): void {
    this.oSprite.fixedToCamera = cameraFixed;
    this.panelSprite.fixedToCamera = cameraFixed;
    this.text.fixedToCamera = cameraFixed;
    for (let i = 0; i < this.optionList.length; i++) {
      this.optionList[i].fixedToCamera = cameraFixed;
    }
  }

  public setVisibility(visibility: boolean): void {
    this.oSprite.visible = visibility;
    this.panelSprite.visible = visibility;
    this.text.visible = visibility;

    for (let i = 0; i < this.optionList.length; i++) {
      this.optionList[i].visible = visibility;
    }
  }

  public toggle(): void {

    this.oSprite.visible ? this.setVisibility(false) : this.setVisibility(true);

    // if ((this.panelSprite.y <= this.game.height - this.panelSprite.height) || 
    //     (this.panelSprite.y >= this.game.height)) {
    // 
    //   this.setCameraFixed(false);
    //
    //   if (this.panelSprite.y >= this.game.height) {
    //     this.hudYSpeed = -1;
    //   } else {
    //     this.hudYSpeed = 1;
    //   }
    // }

    return 
  }

  public update(): void {
    
    if (this.controller.isSpaceJustDown) {
      this.toggle();
    }

    // if (this.hudYSpeed !== 0) {
    //   this.moveUpDown();
    // }

    // if ((this.panelSprite.y > this.game.height) ||
    //     (this.panelSprite.y < this.game.height - this.panelSprite.height)){
      
    //   this.setCameraFixed(true);

    //   this.hudYSpeed = 0;

    //   // Reset Y location if necessary. Should be okay if hudYspeed is 1

    //   // if (this.panelSprite.y > this.game.height) {
    //   //   this.setVisibility(false);
    //   // } else {
    //   //   this.setVisibility(true);
    //   // }

    // }

    if (this.oSprite.visible) {

      if (this.controller.is1) {
        this.callback(1);
      } else if (this.controller.is2) {
        this.callback(2);
      } else if (this.controller.is3) {
        this.callback(3);
      } else if (this.controller.is4) {
        this.callback(4);
      } 
    }
  }
}
