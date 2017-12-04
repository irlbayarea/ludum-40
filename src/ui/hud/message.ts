// import { Message } from '_debugger';
import * as Phaser from 'phaser-ce';
import { globals } from '../../common';

export default class MessagePanel extends Phaser.Plugin {
  public static readonly gr = 0.5 * (1 + Math.sqrt(5));
  public static readonly mainPanel = new Phaser.Rectangle(
    0,
    globals.dimensions.height * (1 - 1 / MessagePanel.gr ** 3),
    globals.dimensions.width,
    globals.dimensions.height * (1 / MessagePanel.gr ** 3)
  );

  public static readonly textPadX: number = globals.dimensions.width /
    MessagePanel.gr ** 8;
  public static readonly textPadY: number = globals.dimensions.height /
    MessagePanel.gr ** 8;
  public static readonly numOptions: number = 4;

  public static readonly mainTextPanel = new Phaser.Rectangle(
    MessagePanel.mainPanel.x + MessagePanel.textPadX,
    MessagePanel.mainPanel.y + MessagePanel.textPadY,
    MessagePanel.mainPanel.width / MessagePanel.gr ** MessagePanel.gr -
      2 * MessagePanel.textPadX,
    MessagePanel.mainPanel.height - 2 * MessagePanel.textPadY
  );

  public static readonly choicePanel = new Phaser.Rectangle(
    MessagePanel.mainTextPanel.x +
      MessagePanel.mainTextPanel.width +
      2 * MessagePanel.textPadX,
    MessagePanel.mainTextPanel.y,
    MessagePanel.mainPanel.width -
      MessagePanel.mainTextPanel.width -
      4 * MessagePanel.textPadX,
    MessagePanel.mainTextPanel.height
  );

  public static readonly messageClearCountdownTIme: number = 200;

  private messageClearCountdown: number = 0;

  private text: Phaser.Text;

  private mainPanel: Phaser.Sprite;
  private choicePanel: Phaser.Sprite;
  private optionList: Phaser.Text[] = [];

  /**
   * MessagePanel constructor
   */
  constructor(game: Phaser.Game, manager: Phaser.PluginManager) {
    super(game, manager);
  }

  public init(group: Phaser.Group): void {
    const game = this.game;
    const bitmap = game.add.bitmapData(
      globals.dimensions.width,
      globals.dimensions.height
    );

    bitmap.ctx.beginPath();
    bitmap.ctx.globalAlpha = 1 / MessagePanel.gr;
    bitmap.ctx.rect(
      MessagePanel.mainPanel.x,
      MessagePanel.mainPanel.y,
      MessagePanel.mainPanel.width,
      MessagePanel.mainPanel.height
    );
    bitmap.ctx.fillStyle = '#333333';
    bitmap.ctx.fill();

    this.mainPanel = game.add.sprite(0, 0, bitmap);
    this.mainPanel.fixedToCamera = true;
    this.mainPanel.physicsEnabled = true;
    group.add(this.mainPanel);

    const text = game.add.text(0, 0, '...', {
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
      align: 'center',
      fill: '#FFF',
      wordWrap: true,
      wordWrapWidth: MessagePanel.mainTextPanel.width,
      font:
        'bold ' +
        MessagePanel.mainTextPanel.height / MessagePanel.numOptions / 1.5 +
        'px Consolas',
    });
    text.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
    text.setTextBounds(
      MessagePanel.mainTextPanel.x,
      MessagePanel.mainTextPanel.y,
      MessagePanel.mainPanel.width,
      MessagePanel.mainTextPanel.height
    );
    text.fixedToCamera = true;
    group.add(text);

    this.text = text;

    const options = game.add.bitmapData(
      globals.dimensions.width,
      globals.dimensions.height
    );

    options.ctx.beginPath();
    options.ctx.rect(
      MessagePanel.choicePanel.x,
      MessagePanel.choicePanel.y,
      MessagePanel.choicePanel.width,
      MessagePanel.choicePanel.height
    );
    options.ctx.fillStyle = '#787C8B';
    options.ctx.fill();
    options.ctx.strokeStyle = '#565869';
    options.ctx.strokeRect(
      MessagePanel.choicePanel.x,
      MessagePanel.choicePanel.y,
      MessagePanel.choicePanel.width,
      MessagePanel.choicePanel.height
    );
    this.choicePanel = game.add.sprite(0, 0, options);
    this.choicePanel.fixedToCamera = true;
    this.choicePanel.visible = true;
    group.add(this.choicePanel);

    for (let i = 0; i < MessagePanel.numOptions; i++) {
      const choicePanelOption: Phaser.Rectangle = new Phaser.Rectangle(
        MessagePanel.choicePanel.x +
          MessagePanel.textPadX +
          MessagePanel.choicePanel.width /
            2 *
            (i % MessagePanel.numOptions === 0 ||
            i % MessagePanel.numOptions === 2
              ? 0
              : 1),
        MessagePanel.choicePanel.y +
          MessagePanel.textPadY * (2 / 3) +
          MessagePanel.choicePanel.height /
            2 *
            (i % MessagePanel.numOptions === 0 ||
            i % MessagePanel.numOptions === 1
              ? 0
              : 1),
        MessagePanel.choicePanel.width / 2,
        MessagePanel.choicePanel.height / 2
      );
      this.optionList.push(
        game.add.text(0, 0, '', {
          fill: '#FFFFFF',
          font:
            (MessagePanel.choicePanel.height - 2 * MessagePanel.textPadY) / 4 +
            'px Consolas',
          wordWrap: true,
          wordWrapWidth:
            MessagePanel.choicePanel.width / 2 - MessagePanel.textPadX,
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

  public setOptions(optionListInput: string[]): void {
    if (optionListInput.length > MessagePanel.numOptions) {
      throw new Error(
        '>' + MessagePanel.numOptions + ' questions not yet supported'
      );
    } else {
      this.choicePanel.visible = true;
      this.mainPanel.visible = true;
      this.text.setTextBounds(
        MessagePanel.mainTextPanel.x,
        MessagePanel.mainTextPanel.y,
        MessagePanel.mainTextPanel.width,
        MessagePanel.mainTextPanel.height
      );
      for (let i = 0; i < optionListInput.length; i++) {
        this.optionList[i].text = `[ ${i + 1} ] ${optionListInput[i]}`;
        this.optionList[i].visible = true;
      }
    }
  }

  public clearOptions(): void {
    for (const opt of this.optionList) {
      opt.text = '';
      opt.visible = true;
    }
    this.text.setTextBounds(
      MessagePanel.mainTextPanel.x,
      MessagePanel.mainTextPanel.y,
      MessagePanel.mainPanel.width,
      MessagePanel.mainTextPanel.height
    );
    this.mainPanel.visible = false;
    this.choicePanel.visible = false;
  }

  public setText(message: string): void {
    this.text.visible = true;
    this.text.text = message;
  }

  public clearText(): void {
    this.text.text = '';
    this.text.visible = false;
  }

  public startCountdown(): void {
    this.messageClearCountdown = MessagePanel.messageClearCountdownTIme;
  }

  public countdown(): boolean {
    if (this.messageClearCountdown > 0) {
      this.messageClearCountdown -= 1;
      return this.messageClearCountdown <= 0;
    } else {
      return false;
    }
  }
}
