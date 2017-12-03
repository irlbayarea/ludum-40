import * as Phaser from 'phaser-ce';

export default class Path {
  public static readonly CLOSE_DISTANCE: number = 8 / 64;

  public curIndex: number;

  public constructor(public readonly points: Array<{ x: number; y: number }>) {
    this.curIndex = 0;
  }

  /**
   * Returns the next point goal to reach or null if we are done.
   */
  public currentGoal(): { x: number; y: number } | null {
    if (this.curIndex >= this.points.length) {
      return null;
    }
    const p = this.points[this.curIndex];
    return { x: p.x + 0.5, y: p.y + 0.5 };
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
}
