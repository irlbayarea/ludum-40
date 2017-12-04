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
import Controller from './input/controller';
import { SpawnConfig } from './character/spawn_config';
import { Armory } from './ui/sprites/armory';
import BloodFactory from './ui/sprites/blood';
import Character from './character/character';
import HudBuilder from './ui/hud/hud_builder';
import GameOver from './ui/states/over';

export class Game extends phaser.Game {
  public generators: ITicker[];
  public gameEvents: events.GameEvents;
  public hud: HudModel;
  public worldState: WorldState;
  public controller: Controller;
  public readonly armory: Armory;
  public readonly blood: BloodFactory;
  public isOfferingContract: boolean;

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
    this.state.add('Over', GameOver);
    this.state.start('Boot');

    this.isOfferingContract = false;
    this.hud = new HudBuilder().build();
    this.armory = new Armory(this);
    this.blood = new BloodFactory(this);
    this.worldState = new WorldState(40, 40);

    // Enable events.
    this.gameEvents = new events.GameEvents();
    events.registerGlobalHandlers(this);

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

  public spawn(config: SpawnConfig): Phaser.Sprite {
    const sprite = game.add.sprite(
      config.x * 64,
      config.y * 64,
      config.texture
    );
    sprite.scale = new Phaser.Point(4.0, 4.0);
    game.physics.p2.enable(sprite);
    sprite.body.fixedRotation = true;
    sprite.body.clearShapes();
    sprite.body.addCircle(17, 0, 0, 0);
    sprite.maxHealth = sprite.health;
    config.character.setSprite(sprite);
    game.worldState.addCharacter(config.character);
    return sprite;
  }

  public offerContract(
    character: Character,
    onPurchase: (character: Character) => void
  ) {
    // Bug I don't understand.
    if (!onPurchase) {
      return;
    }
    this.isOfferingContract = true;
    this.hud = this.hud.setQuestion(
      'Do you want to hire ' + character.name + '?',
      ['yes', 'no'],
      (option: number) => {
        this.isOfferingContract = false;
        this.hud = this.hud.clearQuestion();
        if (option === 1) {
          this.hud = this.hud.setMessage('You hired ' + character.name + '!');
          onPurchase(character);
        } else if (option === 2) {
          this.hud = this.hud.setMessage('Oh. Okay.');
        }
      }
    );
  }
}

if (common.globals.debug) {
  const $DEBUG = {
    generateMap: () => generateMap(21, 21),
  };
  common.debug.log('Debugging enabled', common.globals);
  common.debug.log(
    'See the "$D" object for helper functions',
    Object.keys($DEBUG)
  );
  (window as any).$D = $DEBUG;
}

export const game = new Game();
