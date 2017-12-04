import * as Debug from 'debug';
import { forIn, assign } from 'lodash';
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
    goblinSpawnRateMs: 2000,
    goblinThinkRateMs: 1000,
    goblinVisionDistance: 10,

    denAndHutHP: 20,

    npcAttackRateMs: 300,
    maximumCharacters: 100,
    promotionsRateMs: 1500,

    contractRateMs: 20 * 1000,
    crisisRateMs: 10 * 1000,
    defaultWeaponRange: 1.25,
    playerRangeModifier: 0.75,
    playerStartingHP: 100,
    hutSpawnRateMs: 15 * 1000,
    denSpawnRateMs: 20 * 1000,
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

if (experiment('accelerated')) {
  assign(globals.gameplay, {
    hutSpawnRateMs: globals.gameplay.hutSpawnRateMs / 10,
    denSpawnRateMs: globals.gameplay.denSpawnRateMs / 10,
  });
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
    /**
     * How often to spawn goblins at dens.
     */
    goblinSpawnRateMs: number;

    /**
     * How often to have goblins think about objectives.
     */
    goblinThinkRateMs: number;

    /**
     * How far the goblin can "see" in order to take actions.
     */
    goblinVisionDistance: number;

    /**
     * How often to have armed NPCs swing their weapon.
     *
     * TODO: We should allow this number to be accelerated for stronger NPCs.
     */
    npcAttackRateMs: number;

    /**
     * How much HP to give Dens/Huts.
     */
    denAndHutHP: number;

    /**
     * Maximum number of rendered characters.
     */
    maximumCharacters: number;

    /**
     * How often to check for promotions.
     */
    promotionsRateMs: number;

    contractRateMs: number;
    crisisRateMs: number;
    defaultWeaponRange: number;
    playerRangeModifier: number;
    playerStartingHP: number;
    hutSpawnRateMs: number;
    denSpawnRateMs: number;
  };
}

/**
 * Converts an object with x and y fields to a Phaser Point.
 */
export function xyObjToPoint(p: { x: number; y: number }): Phaser.Point {
  return new Phaser.Point(p.x, p.y);
}
