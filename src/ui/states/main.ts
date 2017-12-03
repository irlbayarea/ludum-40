import * as Phaser from 'phaser-ce';
import { forIn, last } from 'lodash';

import Controller from '../../input/controller';
import MessagePanel from '../message';

import * as common from '../../common';
import { game } from '../../index';
import CrisisEvent from '../../crisis/crisis_event';
import EventType from '../../event_type';
import Event from '../../event';
import Crisis from '../../crisis/crisis';
import HudRenderer from '../hud/hud_renderer';
import UserQuestion from '../../user_question';

/**
 * Main state (i.e. in the game).
 */
export default class Main extends Phaser.State {
  private controller: Controller;
  private character: Phaser.Sprite;
  private alwaysOnTop: Phaser.Group;
  private hudRenderer: HudRenderer;

  public create(): void {
    this.createMap();

    game.gameEvents.addListener(EventType.CrisisStart, (e: Event) => {
      const crisis: Crisis = e.value;
      game.hud = game.hud.setMessage(
        '🔥🔥 CRISIS! "' + crisis.description + '" Started'
      );
    });

    game.gameEvents.addListener(EventType.CrisisEnd, (e: Event) => {
      const crisis: Crisis = e.value;
      game.hud = game.hud.setMessage('"' + crisis.description + '" Ended.');
    });

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

    // Messages.
    this.alwaysOnTop = this.game.add.group();
    this.hudRenderer = new HudRenderer(this.game.plugins.add(
        MessagePanel,
        this.alwaysOnTop,
        this.controller
    ));
    game.hud = game.hud.setMessage('Welcome to Guard Captain');
    game.hud = game.hud.setQuestion(
      new UserQuestion(['Sushi', 'Tacos'], (option: number) => {
        common.debug.log(
          `Selected: ${option === 1 ? 'Great Choice' : 'Eh, not bad'}`
        );
        game.hud = game.hud.setQuestion(null);
      })
    );
  }

  public update(): void {
    this.character.body.setZeroVelocity();

    // Tick services
    const elapsed: number = game.time.elapsed;
    this.tickEvents(elapsed);
    this.tickCrises(elapsed);

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

  private createMap(): Phaser.Tilemap {
    // Initialize the physics system (P2).
    this.game.physics.startSystem(Phaser.Physics.P2JS);

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

  private tickCrises(elapsed: number) {
    game.crisisGenerator.tick(elapsed).forEach((e: CrisisEvent) => {
      game.gameEvents.emit(EventType.CrisisStart, e.crisis);
      game.gameEvents.schedule(EventType.CrisisEnd, e.crisis, e.duration);
    });
  }

  private tickEvents(elapsed: number) {
    game.gameEvents.tick(elapsed);
  }
}
