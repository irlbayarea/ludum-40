// Forces webpack to inline the files in this precise order.
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
import Main from './ui/states/main';

class Game extends phaser.Game {
  public eventQueue: EventQueue;
  public eventHandlers: EventHandlers;

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

    this.state.add('Boot', Boot);
    this.state.add('Main', Main);
    this.state.start('Boot');
  }
}

if (common.globals.debug) {
  common.debug.log('Debugging enabled', common.globals.dimensions);
}

export const game = new Game();
