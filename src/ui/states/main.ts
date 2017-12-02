import * as Phaser from 'phaser-ce';
import {forIn, last} from 'lodash';

import Controller from '../../input/controller';
import MessagePanel from '../message';

import { game } from '../../index';
import CrisisEvent from '../../crisis/crisis_event';
import Event from '../../event';

/**
 * Main state (i.e. in the game).
 */
export default class Main extends Phaser.State {
  private controller: Controller;
  private character: Phaser.Sprite;
  private messages: MessagePanel;
  private alwaysOnTop: Phaser.Group;

  public create(): void {
    this.createMap();

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
    this.messages = this.game.plugins.add(MessagePanel, this.alwaysOnTop);
    this.messages.setText('🔥🔥 CRISIS! 🔥🔥');
  }

  public update(): void {
<<<<<<< HEAD
    this.character.body.setZeroVelocity();
=======
    const elapsed = game.time.elapsed;

    this.messages.update();

    // Resolve the event queue.
    const completedEvents = game.eventQueue.tick(elapsed);
    if (completedEvents.length > 0) {
      completedEvents.forEach(event => {
        game.eventHandlers.handle(event);
      });
    }
>>>>>>> 17cdabc6fe380a2f7ed9e4537df6f0f553482300

    // Generate more crises.
    const newCrises: CrisisEvent[] = game.crisisGenerator.tick(elapsed);
    if (newCrises.length > 0) {
      newCrises.forEach((crisisEvent: CrisisEvent) => {
        game.eventQueue.add(
          crisisEvent.crisis.description,
          crisisEvent.crisis,
          crisisEvent.duration
        );
        game.eventHandlers.register(
          crisisEvent.crisis.description,
          (_: Event) => {
            // Satisfy linter so I can leave this code sample here.
            // Do whatever else with result.
            game.eventHandlers.unregister(crisisEvent.crisis.description);
          }
        );
      });
    }

    this.game.camera.follow(this.character);
    if (this.controller.isLeft && !this.controller.isRight) {
      this.character.body.moveLeft(400);
    } else if (this.controller.isRight) {
      this.character.body.moveRight(400);
    }
    if (this.controller.isDown && !this.controller.isUp) {
      this.character.body.moveUp(400);
    } else if (this.controller.isUp) {
<<<<<<< HEAD
      this.character.body.moveDown(400);
=======
      this.character.y += 8;
    }

    if (this.controller.isSpace) {
      const distance = this.game.physics.arcade.distanceBetween;
      this.monsters
        .filter(monster => {
          return distance(monster, this.character) <= 64 * 1.5;
        })
        .forEach(monster => {
          monster.damage(1);
          this.bloodFactory.sprite(monster);
        });
      this.monsters = this.monsters.filter(monster => monster.health > 0);
>>>>>>> 17cdabc6fe380a2f7ed9e4537df6f0f553482300
    }

    this.game.world.bringToTop(this.alwaysOnTop);
  }

  private createMap(): Phaser.Tilemap {
    // Initialize the physics system (P2).
    this.game.physics.startSystem(Phaser.Physics.P2JS);

    // Create the map.
    const map = game.add.tilemap('Tilemap');

    // Initialize Tilesets.
    forIn({
      'collision': 'collision',
      'tiles': 'tiles',
    }, (value, key) => map.addTilesetImage(value, key));

    // Initialize Layers.
    const layers = [
      'terrain',
      'foreground',
      'structures',
      'collision',
    ].map(name => map.createLayer(name))

    layers.forEach((layer) => {
      layer.resizeWorld();
      layer.wrap = true;
    });

    const collision = last(layers)!;
    collision.visible = false;
    
    const p2 = this.game.physics.p2;
    const collisionIndex = collision.getTiles(0, 0, 1, 1,)[0].index;
    map.setCollision(collisionIndex, true, collision);
    p2.convertTilemap(map, collision, true, true);
    p2.setBoundsToWorld(true, true, true, true, false);
    p2.restitution = 0.2; // Bounciness of '1' is very bouncy.
    p2.gravity.y = 300;

    return map;
  }
}
