import * as phaser from 'phaser-ce';
import * as common from './common';

import Main from './ui/states/main';

class Game extends phaser.Game {
  constructor(config: phaser.IGameConfig) {
    super(config);

    this.state.add('Main', Main);
    this.state.start('Main');
  }
}

if (common.globals.debug) {
  common.debug.log('Debugging enabled!');
}

// tslint:disable-next-line:no-unused-expression
new Game({});
