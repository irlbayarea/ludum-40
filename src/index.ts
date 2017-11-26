import * as phaser from 'phaser-ce';
import * as common from './common';

import Main from './ui/states/main';

class Game extends phaser.Game {
  constructor() {
    super({
      height: common.globals.dimensions.height,
      parent: '',
      renderer: phaser.AUTO,
      resolution: 1,
      width: common.globals.dimensions.width,
    });

    this.state.add('Main', Main);
    this.state.start('Main');
  }
}

if (common.globals.debug) {
  common.debug.log('Debugging enabled', common.globals.dimensions);
}

export const game = new Game();
