import * as Phaser from 'phaser-ce';
import { xyObjToPoint } from '../common';
import { game } from '../index';

export default class Path {
  public static readonly CLOSE_DISTANCE: number = 8 / 64;

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

  public constructor(points: Array<{ x: number; y: number }>) {
    this.curIndex = 0;
    this.points = [];
    points.forEach(p => {
      const pp: Phaser.Point = new Phaser.Point(p.x, p.y);
      this.points.push(pp);
    });
  }

  /**
   * Returns the next point goal to reach or null if we are done.
   */
  public currentGoal(): { x: number; y: number } | null {
    if (this.curIndex >= this.points.length) {
      return null;
    }
    const p = this.points[this.curIndex];
    const j = Path.jigglePoint(p);
    return { x: j.x + 0.5, y: j.y + 0.5 };
  }

  /**
   * Returns true if the given position is near the goal. Expects that
   * currentGoal() does not return null.
   */
  public isNearGoal(pos: { x: number; y: number }): boolean {
    const currentGoalPos: { x: number; y: number } | null = this.currentGoal();
    return (
      new Phaser.Point(pos.x, pos.y).distance(
        new Phaser.Point(currentGoalPos!.x, currentGoalPos!.y)
      ) <= Path.CLOSE_DISTANCE
    );
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
