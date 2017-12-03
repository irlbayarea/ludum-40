import { Game } from '../../index';

export default class HudList {
  constructor(
    private readonly game: Game,
    private readonly x: number,
    private readonly y: number
  ) {}

  public write(m: string) {
    this.game.add.text(
      this.x,
      this.y,
      m,
      { font: '15px Arial', fill: '#000' }
    ).fixedToCamera = true;
  }
}
