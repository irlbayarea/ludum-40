// Forces webpack to inline the files in this precise order.
import 'p2';
import 'pixi';
// tslint:disable-next-line:ordered-imports
import 'phaser';
// End force webpack inline.

import * as phaser from 'phaser-ce';
import * as common from './common';
import * as events from './events';

import Boot from './ui/states/boot';
<<<<<<< HEAD
import EventHandlers from './event_handler';
import EventQueue from './event_queue';
=======
import { generateMap } from './map/generator';
>>>>>>> c118f5c11cdbafccf029468096c974a321cb7193
import Main from './ui/states/main';
import ICrisisGenerator from './crisis/crisis_generator';
<<<<<<< HEAD
import WorldState from './world_state/world_state';
=======
import HudModel from './ui/hud/hud_model';
import GoblinGenerator from './character/character_generator';
>>>>>>> c118f5c11cdbafccf029468096c974a321cb7193

export class Game extends phaser.Game {
  public crisisGenerator: ICrisisGenerator;
<<<<<<< HEAD
  public worldState: WorldState;
=======
  public goblinGenerator: GoblinGenerator;
  public gameEvents: events.GameEvents;
  public hud: HudModel;
>>>>>>> c118f5c11cdbafccf029468096c974a321cb7193

  constructor() {
    super({
      height: common.globals.dimensions.height,
      parent: '',
      renderer: phaser.AUTO,
      resolution: 1,
      width: common.globals.dimensions.width,
    });

    this.state.add('Boot', Boot);
    this.state.add('Main', Main);
    this.state.start('Boot');

    this.worldState = new WorldState(40, 40);
  }
}

if (common.globals.debug) {
  common.debug.log('Debugging enabled', common.globals.dimensions);
<<<<<<< HEAD
=======
  common.debug.log('Experiments enabled', common.globals.experiments);
  common.debug.log(
    'See the "$D" object for helper functions',
    Object.keys($DEBUG)
  );
  (window as any).$D = $DEBUG;
>>>>>>> c118f5c11cdbafccf029468096c974a321cb7193
}

export const game = new Game();
