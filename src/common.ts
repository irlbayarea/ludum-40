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
    goblinSpawnRateMs: 15 * 100,
    contractRateMs: 20 * 1000,
    crisisRateMs: 10 * 1000,
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
    goblinSpawnRateMs: number;
    contractRateMs: number;
    crisisRateMs: number;
  };
}
