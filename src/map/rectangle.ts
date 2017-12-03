export default class Rectangle {
  public x: number;
  public y: number;

  public w: number;
  public h: number;

  constructor(x: number, y: number, w: number = 0, h: number = 0) {
    this.x = x;
    this.h = h;
    this.y = y;
    this.w = w;
  }
}
