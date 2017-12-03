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
import { generateMap } from './map/generator';
import Main from './ui/states/main';
import PeriodicCrisisGenerator from './crisis/periodic_crisis_generator';
import ICrisisGenerator from './crisis/crisis_generator';
import { jsonCrises } from './crisis/crises';
import CrisisSerializer from './crisis/crisis_serializer';
import HudModel from './ui/hud/hud_model';
import HudBuilder from './ui/hud/hud_builder';

export class Game extends phaser.Game {
  public crisisGenerator: ICrisisGenerator;
  public gameEvents: events.GameEvents;
  public hud: HudModel;

  constructor() {
    super({
      height: common.globals.dimensions.height,
      parent: '',
      renderer: phaser.AUTO,
      resolution: 1,
      width: common.globals.dimensions.width,
    });

    this.hud = new HudBuilder().build();

    const globalHandlers = new events.EventHandlers();
    events.registerGlobalHandlers(globalHandlers, this);
    this.gameEvents = new events.GameEvents(globalHandlers);

    const crises = CrisisSerializer.unserializeAll(JSON.stringify(jsonCrises));
    this.crisisGenerator = new PeriodicCrisisGenerator(15000, crises);

    this.state.add('Boot', Boot);
    this.state.add('Main', Main);
    this.state.start('Boot');
  }
}

if (common.globals.debug) {
  const $DEBUG = {
    generateMap: () => generateMap(21, 21),
  };
  common.debug.log('Debugging enabled', common.globals.dimensions);
  common.debug.log('Experiments enabled', common.globals.experiments);
  common.debug.log(
    'See the "$D" object for helper functions',
    Object.keys($DEBUG)
  );
  (window as any).$D = $DEBUG;
}

export const game = new Game();
