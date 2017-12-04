import * as Debug from 'debug';
import { forIn } from 'lodash';
import { parse } from 'query-string';

/**
 * Shared debugger for the entire application.
 */
export const debug = Debug('game');
debug.log = console.log.bind(console);

declare const __DEBUG: boolean;
declare const __DIMENSIONS: IGlobals['dimensions'];
declare const __EXPERIMENTS: {
  [key: string]: boolean;
};

/**
 * Experiments enabled by the user.
 */
const userExperiments: { [key: string]: boolean } = __EXPERIMENTS;
forIn(parse(location.search), (value, key) => {
  userExperiments[key] = value !== 'false';
});

export const globals: IGlobals = {
  debug: __DEBUG,
  dimensions: {
    height: __DIMENSIONS.height,
    width: __DIMENSIONS.width,
  },
  experiments: userExperiments,
  gameplay: {
    aggroRange: 15,
    contractRateMs: 20 * 1000,
    crisisRateMs: 10 * 1000,
    goblinSpawnRateMs: 15 * 100,
    defaultWeaponRange: 1.25,
    playerRangeModifier: 0.75,
    playerStartingHP: 100,
  },
};

/**
 * Whether the provided experiment is enabled.
 *
 * @param name
 */
export function experiment(name: string): boolean {
  return globals.experiments[name] === true;
}

/**
 * Global readonly constants shared across the entire application.
 */
interface IGlobals {
  /**
   * Whether the application is in "debug" mode.
   */
  readonly debug: boolean;

  /**
   * Dimensions to launch the game as.
   */
  readonly dimensions: {
    readonly height: number;
    readonly width: number;
  };

  /**
   * Experiments
   */
  readonly experiments: {
    [key: string]: boolean;
  };

  /**
   * Gampeplay configuration.
   */
  readonly gameplay: {
    aggroRange: number;
    goblinSpawnRateMs: number;
    contractRateMs: number;
    crisisRateMs: number;
    defaultWeaponRange: number;
    playerRangeModifier: number;
    playerStartingHP: number;
  };
}

/**
 * Converts an object with x and y fields to a Phaser Point.
 */
export function xyObjToPoint(p: { x: number; y: number }): Phaser.Point {
  return new Phaser.Point(p.x, p.y);
}
