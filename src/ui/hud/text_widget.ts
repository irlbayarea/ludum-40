import { Game } from '../../index';

export default class TextWidget {
  private text: Phaser.Text;

  constructor(
    private readonly game: Game,
    private readonly x: number,
    private readonly y: number,
    private readonly w: number,
    private readonly h: number,
    fontSize: number,
    font: string
  ) {
    this.text = this.game.add.text(this.x, this.y, '', {
      font: 'bold ' + fontSize + 'px ' + font,
      fill: '#FFFFFF',
      boundsAlignH: 'left',
      boundsAlignV: 'middle',
    });
    this.text.setTextBounds(this.x / 4, this.y / 4, this.w, this.h);
    this.text.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 3, true, true);
    this.text.align = 'center';
    // this.text.anchor.set(0.5, 0.5);
    this.text.fixedToCamera = true;
  }

  public write(m: string) {
    this.text.text = m;
  }

  public bringToTop(): void {
    this.text.bringToTop();
  }
}
