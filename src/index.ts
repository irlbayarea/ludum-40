// Forces webpack to inline the files in this precise order.
import Player from './character/player';
import 'p2';
import 'pixi';
// tslint:disable-next-line:ordered-imports
import 'phaser';
// End force webpack inline.

import * as phaser from 'phaser-ce';
import * as common from './common';

import Boot from './ui/states/boot';
import EventHandlers from './event_handler';
import EventQueue from './event_queue';
import { generateMap } from './map/generator';
import Main from './ui/states/main';
import PeriodicCrisisGenerator from './crisis/periodic_crisis_generator';
import ICrisisGenerator from './crisis/crisis_generator';
import WorldState from './world_state/world_state';

class Game extends phaser.Game {
  public eventQueue: EventQueue;
  public eventHandlers: EventHandlers;
  public crisisGenerator: ICrisisGenerator;
  public worldState: WorldState;

  constructor() {
    super({
      height: common.globals.dimensions.height,
      parent: '',
      renderer: phaser.AUTO,
      resolution: 1,
      width: common.globals.dimensions.width,
    });

    this.eventQueue = new EventQueue(0);
    this.eventHandlers = new EventHandlers();
    this.crisisGenerator = new PeriodicCrisisGenerator(1000);

    this.state.add('Boot', Boot);
    this.state.add('Main', Main);
    this.state.start('Boot');

    this.worldState = new WorldState(40, 40);
  }
}

if (common.globals.debug) {
  common.debug.log('Debugging enabled', common.globals.dimensions);
  common.debug.log('Experiments enabled', common.globals.experiments);
  common.debug.log(
    'See the "$D" object for helper functions',
    Object.keys($DEBUG)
  );
  (window as any).$D = $DEBUG;
}

export const game = new Game();
