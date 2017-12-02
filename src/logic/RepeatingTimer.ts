import * as Phaser from 'phaser-ce';

/**
 * A timer that triggers on a repeating interval. Call `isReady` and then `use` to utilize the timer. The timer is
 * active every `repeatPeriodSeconds` for a single tick.
 */
export default class RepeatingTimer {
  private lastTriggeredTimeSeconds: number;

  public constructor(private readonly game: Phaser.Game, private readonly repeatPeriodSeconds: number) {
    this.lastTriggeredTimeSeconds = this.frameTimeSeconds();
  }
  
  private frameTimeSeconds(): number {
    return this.game.time.now / 1000;
  }

  public ready(): boolean {
    return this.lastTriggeredTimeSeconds + this.repeatPeriodSeconds < this.frameTimeSeconds();
  }

  public use(): void {
    this.lastTriggeredTimeSeconds += this.repeatPeriodSeconds;
  }
}
