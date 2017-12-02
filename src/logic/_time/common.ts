import { game } from '../../index';

/**
 * The Time class enables retrieving the time in seconds, both game time and wall time (real world time).
 */
export default class Time {
  /**
   * Returns a timestamp that is the number of game time seconds passed since an arbitrary epoch until
   */
  public static gameTime(): number {
    return game.physics.p2.time;
  }

  /**
   * Returns the game time elapsed in seconds since the last tick.
   */
  public static gameElapsed(): number {
    return game.physics.p2.time;
  }

  /**
   * Returns a timestamp that is the number of real world seconds passed since an arbitrary epoch.
   */
  public static wallTime(): number {
    return game.time.now / 1000;
  }

  /**
   * Returns the real world time elapsed in seconds since last tick.
   */
  public static wallElapsed(): number {
    return game.time.elapsed / 1000;
  }
}
