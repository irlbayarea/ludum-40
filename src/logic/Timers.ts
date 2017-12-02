import Time from './Time';

/**
 * A timer that triggers on a repeating interval. Call `isReady` and then `use`
 * to utilize the timer. The timer is active every `repeatPeriodSeconds` for a
 * single tick. This timer uses the game world time, not wall time.
 *
 * If `use` is not called, it stockpiles, so this timer is expected to be used
 * as often as it is ready.
 */
export class RepeatingWorldTimer {
  private lastTriggeredTime: number;

  /**
   * @param repeatPeriod In seconds.
   * @param triggerNow Whether this timer is ready immediately.
   */
  public constructor(
    private readonly repeatPeriod: number,
    triggerNow: boolean = false
  ) {
    if (!triggerNow) this.lastTriggeredTime = Time.gameTime();
    else this.lastTriggeredTime = Time.gameTime() - repeatPeriod;
  }

  public isReady(): boolean {
    return Time.gameTime() >= this.lastTriggeredTime + this.repeatPeriod;
  }

  public use(): void {
    this.lastTriggeredTime += this.repeatPeriod;
  }
}

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
