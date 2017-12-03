import * as Phaser from 'phaser-ce';
import { forIn, last } from 'lodash';

import Controller from '../../input/controller';
import MessagePanel from '../message';

import * as common from '../../common';
import * as events from '../../events';

import { game } from '../../index';
import CrisisEvent from '../../crisis/crisis_event';
import { generateMap, convertToTiles } from '../../map/generator';
import HudRenderer from '../hud/hud_renderer';
import UserQuestion from '../../user_question';
import HudBuilder from '../hud/hud_builder';
import CrisisSerializer from '../../crisis/crisis_serializer';
import { jsonCrises } from '../../crisis/crises';
import PeriodicCrisisGenerator from '../../crisis/periodic_crisis_generator';
import CharacterGenerator from '../../character/character_generator';

/**
 * Main state (i.e. in the game).
 */
export default class Main extends Phaser.State {
  private controller: Controller;
  private character: Phaser.Sprite;
  private alwaysOnTop: Phaser.Group;
  private hudRenderer: HudRenderer;

  public create(): void {
    // Enable keyboard.
    this.controller = new Controller(this.game);

    // Enable physics.
    this.game.physics.startSystem(Phaser.Physics.P2JS);

    // Example of the main character.
    this.character = this.game.add.sprite(0, 64 * 4, 'characters', 325);
    this.character.scale = new Phaser.Point(4.0, 4.0);
    this.game.physics.p2.enable(this.character);
    this.character.body.fixedRotation = true;
    this.game.camera.follow(this.character);

    // Enable events.
    const globalHandlers = new events.EventHandlers();
    events.registerGlobalHandlers(globalHandlers, game);
    game.gameEvents = new events.GameEvents(globalHandlers);

    // Enable crisis events.
    const crises = CrisisSerializer.unserializeAll(JSON.stringify(jsonCrises));
    game.crisisGenerator = new PeriodicCrisisGenerator(
      common.globals.gameplay.crisisRateMs,
      crises
    );

    // Enable character events.
    game.goblinGenerator = new CharacterGenerator(
      common.globals.gameplay.goblinSpawnRateMs,
      'guard'
    );

    // Enable HUD.
    game.hud = new HudBuilder().build();
    this.alwaysOnTop = this.game.add.group();
    this.hudRenderer = new HudRenderer(
      this.game.plugins.add(MessagePanel, this.alwaysOnTop, this.controller)
    );

    game.hud = game.hud.setMessage('Welcome to Guard Captain');
    if (common.experiment('demo-ask-users')) {
      game.hud = game.hud.setQuestion(
        new UserQuestion(['Sushi', 'Tacos'], (option: number) => {
          common.debug.log(
            `Selected: ${option === 1 ? 'Great Choice' : 'Eh, not bad'}`
          );
          game.hud = game.hud.setQuestion(null);
        })
      );
    }
  }

  public preload(): void {
    this._createMap();
  }

  public update(): void {
    this.character.body.setZeroVelocity();
    const elapsed: number = game.time.elapsed;

    if (common.experiment('demo-crisis')) {
      this.tickEvents(elapsed);
      this.tickCrises(elapsed);
    }
    if (common.experiment('goblin')) {
      this.tickGoblinGenerator(elapsed);
    }

    // Render
    this.hudRenderer.render(game.hud);

    this.game.camera.follow(this.character);
    if (this.controller.isLeft && !this.controller.isRight) {
      this.character.body.moveLeft(400);
    } else if (this.controller.isRight) {
      this.character.body.moveRight(400);
    }
    if (this.controller.isDown && !this.controller.isUp) {
      this.character.body.moveUp(400);
    } else if (this.controller.isUp) {
      this.character.body.moveDown(400);
    }

    this.game.world.bringToTop(this.alwaysOnTop);
  }

  private _createMap(): Phaser.Tilemap {
    // Initialize the physics system (P2).
    this.game.physics.startSystem(Phaser.Physics.P2JS);

    if (common.experiment('use-generated-map')) {
      return this.createGeneratedMap();
    } else {
      return this.createDefaultMap();
    }
  }

  private createDefaultMap(): Phaser.Tilemap {
    // Create the map.
    const map = game.add.tilemap('Tilemap');

    // Initialize Tilesets.
    forIn(
      {
        collision: 'collision',
        tiles: 'tiles',
      },
      (value, key) => map.addTilesetImage(value, key)
    );

    // Initialize Layers.
    const layers = ['terrain', 'foreground', 'structures', 'collision'].map(
      name => map.createLayer(name)
    );

    layers.forEach(layer => {
      layer.resizeWorld();
      layer.wrap = true;
    });

    const collision = last(layers)!;
    collision.visible = false;

    const p2 = this.game.physics.p2;
    const collisionIndex = collision.getTiles(0, 0, 1, 1)[0].index;
    map.setCollision(collisionIndex, true, collision);
    p2.convertTilemap(map, collision, true, true);
    p2.setBoundsToWorld(true, true, true, true, false);
    p2.restitution = 0.2; // Bounciness of '1' is very bouncy.

    return map;
  }

  private createGeneratedMap(): Phaser.Tilemap {
    const map = generateMap(43, 43);
    return convertToTiles(map, this.game, 'tiles');
  }

  private tickCrises(elapsed: number) {
    game.crisisGenerator.tick(elapsed).forEach((e: CrisisEvent) => {
      game.gameEvents.emit(events.EventType.CrisisStart, e.crisis);
      game.gameEvents.schedule(
        events.EventType.CrisisEnd,
        e.crisis,
        e.duration
      );
    });
  }

  private tickEvents(elapsed: number) {
    game.gameEvents.tick(elapsed);
  }

  private tickGoblinGenerator(elapsed: number) {
    game.goblinGenerator.tick(elapsed).forEach(spawnEvent => {
      game.gameEvents.emit(
        events.EventType.CharacterSpawn,
        spawnEvent.spriteName
      );
    });
  }
}
