import * as Phaser from 'phaser-ce';
import Controller from '../input/controller';

export default class MessagePanel extends Phaser.Plugin {
  private controller: Controller;

  private text: Phaser.Text;

  private oSprite: Phaser.Sprite;
  private option1: Phaser.Text;
  private option2: Phaser.Text;
  private callback: (option: number) => void;

  constructor(game: Phaser.Game, manager: Phaser.PluginManager) {
    super(game, manager);
  }

  public init(group: Phaser.Group, controller: Controller): void {
    this.controller = controller;

    const game = this.game;
    const bitmap = game.add.bitmapData(game.width, game.height);

    bitmap.ctx.beginPath();
    bitmap.ctx.globalAlpha = 0.7;
    bitmap.ctx.rect(0, game.height - 100, game.width, 100);
    bitmap.ctx.fillStyle = '#333333';
    bitmap.ctx.fill();

    const sprite = game.add.sprite(0, 0, bitmap);
    sprite.fixedToCamera = true;
    group.add(sprite);

    const text = game.add.text(0, 0, '...', {
      boundsAlignH: 'left',
      boundsAlignV: 'middle',
      fill: '#FFF',
      font: 'bold 24px Arial',
    });
    text.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
    text.setTextBounds(50, game.height - 100, game.width, 100);
    text.fixedToCamera = true;
    group.add(text);

    this.text = text;

    const options = game.add.bitmapData(game.width, game.height);

    options.ctx.beginPath();
    options.ctx.rect(600, game.height - 90, 190, 80);
    options.ctx.fillStyle = '#787C8B';
    options.ctx.fill();
    options.ctx.strokeStyle = '#565869';
    options.ctx.strokeRect(600, game.height - 90, 190, 80);
    this.oSprite = game.add.sprite(0, 0, options);
    this.oSprite.fixedToCamera = true;
    group.add(this.oSprite);

    this.option1 = game.add.text(0, 0, '[ 1 ]   Say Hello', {
      fill: '#FFF',
      font: '13px Arial',
    });
    this.option2 = game.add.text(0, 0, '[ 2 ]   Say Goodbye', {
      fill: '#FFF',
      font: '13px Arial',
    });
    this.option1.setTextBounds(
      game.width - 180,
      game.height - 80,
      game.width,
      40
    );
    this.option2.setTextBounds(
      game.width - 180,
      game.height - 40,
      game.width,
      40
    );
    group.add(this.option1);
    group.add(this.option2);

    this.oSprite.visible = this.option1.visible = this.option2.visible = false;
    this.option1.fixedToCamera = this.option2.fixedToCamera = true;
  }

  public askUser(
    option1: string,
    option2: string,
    callback: (option: number) => void
  ): void {
    this.oSprite.visible = true;
    this.callback = callback;
    this.option1.text = `[ 1 ] ${option1}`;
    this.option1.visible = true;
    this.option2.text = `[ 2 ] ${option2}`;
    this.option2.visible = true;
  }

  public setText(message: string): void {
    this.text.text = message;
  }

  public update(): void {
    if (this.oSprite.visible) {
      if (this.controller.is1) {
        this.callback(1);
        this.oSprite.visible = this.option1.visible = this.option2.visible = false;
      } else if (this.controller.is2) {
        this.callback(2);
        this.oSprite.visible = this.option1.visible = this.option2.visible = false;
      }
    }
  }
}
