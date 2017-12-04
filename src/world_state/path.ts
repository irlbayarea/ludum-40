import { xyObjToPoint } from '../common';
import { game } from '../index';
import * as Phaser from 'phaser-ce';

export default class Path {
  public static readonly CLOSE_DISTANCE: number = 8 / 64;

  /**
   * Returns true if the given position is near the goal position.
   */
  public static isNearGoal(pos: Phaser.Point, goalPos: Phaser.Point): boolean {
    return pos.distance(goalPos) <= Path.CLOSE_DISTANCE;
  }

  /**
   * Returns a jiggled point in world coordiantes.
   */
  private static jigglePoint(p: Phaser.Point): Phaser.Point {
    return new Phaser.Point(
      p.x + (Math.random() - 0.5) * 0.2,
      p.y + (Math.random() - 0.5) * 0.2
    );
  }

  public curIndex: number;
  private points: Phaser.Point[];

  public constructor(points: Phaser.Point[]) {
    this.curIndex = 0;
    this.points = [];
    points.forEach(p => {
      this.points.push(p);
    });
  }

  /**
   * Returns the next goal position to reach or null if we are done.
   */
  public currentGoal(): Phaser.Point | null {
    if (this.curIndex >= this.points.length) {
      return null;
    }
    const p = this.points[this.curIndex];
    const j = Path.jigglePoint(p);
    return new Phaser.Point(j.x + 0.5, j.y + 0.5);
  }

  /**
   * Advances to the next goal.
   */
  public advance(): void {
    this.curIndex += 1;
  }

  public drawDebug(fromPoint: Phaser.Point): void {
    for (let i: number = this.curIndex; i < this.points.length; i++) {
      const a: Phaser.Point =
        i === 0
          ? new Phaser.Point(fromPoint.x - 0.5, fromPoint.y - 0.5)
          : xyObjToPoint(this.points[i - 1]);
      const b: Phaser.Point = xyObjToPoint(this.points[i]);
      a.x = (a.x + 0.5) * 64;
      a.y = (a.y + 0.5) * 64;
      b.x = (b.x + 0.5) * 64;
      b.y = (b.y + 0.5) * 64;

      const line: Phaser.Line = new Phaser.Line(a.x, a.y, b.x, b.y);
      game.debug.lineWidth = 3;
      game.debug.geom(line, 'rgba(0,100,255,255)', true);
    }
    for (let i: number = this.curIndex; i < this.points.length; i++) {
      const p: Phaser.Point = xyObjToPoint(this.points[i]);
      p.x = (p.x + 0.5) * 64;
      p.y = (p.y + 0.5) * 64;
      const circle: Phaser.Circle = new Phaser.Circle(p.x, p.y, 12);
      game.debug.geom(circle, 'rgba(0,255,0,255)');
    }
  }
}
