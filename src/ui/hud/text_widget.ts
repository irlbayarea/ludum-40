import { Game } from '../../index';

export default class TextWidget {
  private text: Phaser.Text;

  constructor(
    private readonly game: Game,
    private readonly x: number,
    private readonly y: number
  ) {
    this.text = this.game.add.text(this.x, this.y, '', {
      font: 'bold 15px Consolas',
      fill: '#000',
    });
    this.text.fixedToCamera = true;
  }

  public write(m: string) {
    this.text.text = m;
  }

  public bringToTop(): void {
    this.text.bringToTop();
  }
}
