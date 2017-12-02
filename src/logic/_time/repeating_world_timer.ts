import Time from './common';

/**
 * A WorldTimer is a timer that triggers after a given amount of time. Call
 * `isReady` to see if the timer is active.
 */
export class WorldTimer {
  private readonly triggerTime: number;

  public constructor(delay: number) {
    this.triggerTime = Time.gameTime() + delay;
  }

  public isReady(): boolean {
    return Time.gameTime() >= this.triggerTime;
  }
}
