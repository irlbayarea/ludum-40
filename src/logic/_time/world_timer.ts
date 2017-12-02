import Time from './common';

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
    this.lastTriggeredTime = !triggerNow
      ? Time.gameTime()
      : Time.gameTime() - repeatPeriod;
  }

  public isReady(): boolean {
    return Time.gameTime() >= this.lastTriggeredTime + this.repeatPeriod;
  }

  public use(): void {
    this.lastTriggeredTime += this.repeatPeriod;
  }
}
