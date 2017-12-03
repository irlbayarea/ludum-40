// Forces webpack to inline the files in this precise order.
import 'p2';
import 'pixi';
// tslint:disable-next-line:ordered-imports
import 'phaser';
// End force webpack inline.

import * as phaser from 'phaser-ce';
import * as common from './common';
import * as events from './events';
import * as generators from './events/generators';

import Boot from './ui/states/boot';
import { generateMap } from './map/generator';
import Main from './ui/states/main';
import WorldState from './world_state/world_state';
import HudModel from './ui/hud/hud_model';
import { ITicker } from './ticker';
import { SpawnConfig } from './character/spawn_config';

export class Game extends phaser.Game {
  public generators: ITicker[];
  public gameEvents: events.GameEvents;
  public hud: HudModel;
  public worldState: WorldState;

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

    // Enable events.
    const globalHandlers = new events.EventHandlers();
    this.gameEvents = new events.GameEvents(globalHandlers);
    events.registerGlobalHandlers(this, globalHandlers);

    // Enable event generators.
    generators.initGenerators(this);
  }

  public getUserInput(
    message: string,
    options: string[],
    callback: (x: number) => void
  ) {
    this.hud = this.hud.setQuestion(message, options, callback);
  }

  public spawn(config: SpawnConfig) {
    const sprite = game.add.sprite(
      config.x * 64,
      config.y * 64,
      config.texture
    );
    sprite.scale = new Phaser.Point(4.0, 4.0);
    game.physics.p2.enable(sprite);

    config.character.setSprite(sprite);
    game.worldState.characters.push(config.character);
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
