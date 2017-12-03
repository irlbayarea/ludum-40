import Rectangle from '../map/rectangle';
import * as Phaser from 'phaser-ce';
import Controller from '../input/controller';

export default class MessagePanel extends Phaser.Plugin {
  private controller: Controller;

  private text: Phaser.Text;

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

    const goldenRatio = 0.5 * (1 + Math.sqrt(5));
    const mainPanel = new Rectangle(
      0,
      game.height * (1 - 1 / goldenRatio ** 3),
      game.width,
      game.height * (1 / goldenRatio ** 3)
    );

    bitmap.ctx.beginPath();
    bitmap.ctx.globalAlpha = goldenRatio;
    bitmap.ctx.rect(mainPanel.x, mainPanel.y, mainPanel.w, mainPanel.h);
    bitmap.ctx.fillStyle = '#333333';
    bitmap.ctx.fill();

    const sprite = game.add.sprite(0, 0, bitmap);
    sprite.fixedToCamera = true;
    group.add(sprite);

    const textPadX = mainPanel.w / goldenRatio ** 8;
    const textPadY = mainPanel.h / goldenRatio ** 4;
    const numLines = 4;

    const mainTextPanel = new Rectangle(
      mainPanel.x + textPadX,
      mainPanel.y + textPadY,
      mainPanel.w / goldenRatio ** goldenRatio - 2 * textPadX,
      mainPanel.h - 2 * textPadY
    );

    const text = game.add.text(0, 0, '...', {
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
      align: 'center',
      fill: '#FFF',
      wordWrap: true,
      wordWrapWidth: mainTextPanel.w,
      font: 'bold ' + mainTextPanel.h / numLines + 'px Consolas',
    });
    text.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
    text.setTextBounds(
      mainTextPanel.x,
      mainTextPanel.y,
      mainTextPanel.w,
      mainTextPanel.h
    );
    text.fixedToCamera = true;
    group.add(text);

    this.text = text;

    const options = game.add.bitmapData(game.width, game.height);

    const choicePanel = new Rectangle(
      mainTextPanel.x + mainTextPanel.w + 2 * textPadX,
      mainTextPanel.y,
      mainPanel.w - mainTextPanel.w - 4 * textPadX,
      mainTextPanel.h
    );

    options.ctx.beginPath();
    options.ctx.rect(
      choicePanel.x,
      choicePanel.y,
      choicePanel.w,
      choicePanel.h
    );
    options.ctx.fillStyle = '#787C8B';
    options.ctx.fill();
    options.ctx.strokeStyle = '#565869';
    options.ctx.strokeRect(
      choicePanel.x,
      choicePanel.y,
      choicePanel.w,
      choicePanel.h
    );
    this.oSprite = game.add.sprite(0, 0, options);
    this.oSprite.fixedToCamera = true;
    group.add(this.oSprite);

    // const optionStrings: string[] = ['Hello There', 'What are you doing in there?' , 'Where are all the Ps?' ,'Yes, business trip...'];
    this.oSprite.visible = false;
    for (let i = 0; i < 4; i++) {
      const choicePanelOption: Rectangle = new Rectangle(
        choicePanel.x +
          textPadX +
          choicePanel.w / 2 * (i === 0 || i === 2 ? 0 : 1),
        choicePanel.y +
          textPadY * (2 / 3) +
          choicePanel.h / 2 * (i === 0 || i === 1 ? 0 : 1),
        choicePanel.w / 2,
        choicePanel.h / 2
      );
      this.optionList.push(
        game.add.text(0, 0, '[ ]', {
          fill: '#FFFFFF',
          font: (choicePanel.h - 2 * textPadY) / 4 + 'px Consolas',
          wordWrap: true,
          wordWrapWidth: choicePanel.w / 2 - textPadX,
        })
      );
      this.optionList[i].setTextBounds(
        choicePanelOption.x,
        choicePanelOption.y,
        choicePanelOption.w,
        choicePanelOption.h
      );
      group.add(this.optionList[i]);
      this.optionList[i].visible = false;
      this.optionList[i].fixedToCamera = true;
    }

    // this.optionList[0].fixedToCamera = this.optionList[1].fixedToCamera = true;
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

  public update(): void {
    if (this.oSprite.visible) {
      if (this.controller.is1) {
        this.callback(1);
      } else if (this.controller.is2) {
        this.callback(2);
      } else if (this.controller.is3) {
        this.callback(3);
      } else if (this.controller.is4) {
        this.callback(4);
      } else {
        return;
      }

      this.oSprite.visible = false;
      for (const i of this.optionList) {
        i.visible = false;
      }
    } else {
      if (this.controller.isSpace) {
        this.oSprite.visible = true;
        for (const i of this.optionList) {
          i.visible = true;
        }
      }
    }
  }
}
