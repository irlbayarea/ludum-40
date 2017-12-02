import * as Phaser from 'phaser-ce';

export default class Path {
  private curIndex: number;

  public constructor(public readonly points: Phaser.Point[]) {
    this.curIndex = 0;
  }
}
