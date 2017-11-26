import * as Debug from 'debug';

/**
 * Shared debugger for the entire application.
 */
export const debug = Debug('game');
debug.log = console.log.bind(console);

declare const __DEBUG: boolean;
declare const __DIMENSIONS: IGlobals['dimensions'];

export const globals: IGlobals = {
  debug: __DEBUG,
  dimensions: {
    height: __DIMENSIONS.height,
    width: __DIMENSIONS.width,
  },
};

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
}
