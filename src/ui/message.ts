import * as Phaser from 'phaser-ce';

export default class MessagePanel extends Phaser.Plugin {
  private text: Phaser.Text;

  constructor(game: Phaser.Game, manager: Phaser.PluginManager) {
    super(game, manager);
    const bitmap = game.add.bitmapData(game.width, game.height);
    bitmap.ctx.beginPath();
    bitmap.ctx.globalAlpha = 0.7;
    bitmap.ctx.rect(0, game.height - 100, game.width, 100);
    bitmap.ctx.fillStyle = '#333333';
    bitmap.ctx.fill();
    game.add.sprite(0, 0, bitmap);

    const text = game.add.text(0, 0, '...', {
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
      fill: '#FFF',
      font: 'bold 24px Arial',
    });
    text.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
    text.setTextBounds(0, game.height - 100, game.width, 100);
    this.text = text;
  }

  public setText(message: string): void {
    this.text.text = message;
  }
}
