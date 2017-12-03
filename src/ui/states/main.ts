import * as Phaser from 'phaser-ce';
import { forIn, last } from 'lodash';

import Controller from '../../input/controller';
import MessagePanel from '../message';

import { game } from '../../index';
import Character from '../../character';
import { debug } from '../../common';

/**
 * Main state (i.e. in the game).
 */
export default class Main extends Phaser.State {
  private controller: Controller;
  private playerSprite: Phaser.Sprite;
  private messages: MessagePanel;
  private alwaysOnTop: Phaser.Group;
  private playerCharacter: Character;

  public create(): void {
    debug;
    this.createMap();

    // Enable keyboard.
    this.controller = new Controller(this.game);

    // Enable physics.
    game.physics.startSystem(Phaser.Physics.P2JS);

    // Main character.
    this.playerSprite = this.game.add.sprite(64 * 5, 64 * 5, 'characters', 325);
    this.playerSprite.scale = new Phaser.Point(4.0, 4.0);
    game.physics.p2.enable(this.playerSprite);
    this.playerSprite.body.fixedRotation = true;
    game.camera.follow(this.playerSprite);

    // Messages.
    this.alwaysOnTop = this.game.add.group();
    this.messages = this.game.plugins.add(MessagePanel, this.alwaysOnTop);
    this.messages.setText('🔥🔥 CRISIS! 🔥🔥');

    this.playerCharacter = new Character(this.playerSprite);
    game.worldState.characters[0] = this.playerCharacter;
    game.worldState.directCharacterToPoint(
      this.playerCharacter,
      new Phaser.Point(15, 15)
    );
  }

  public update(): void {
    game.world.bringToTop(this.alwaysOnTop);
    game.worldState.update();

    if (this.controller.isLeft && !this.controller.isRight) {
      this.playerCharacter.getSprite().body.moveLeft(400);
    } else if (this.controller.isRight) {
      this.playerCharacter.getSprite().body.moveRight(400);
    }
    if (this.controller.isDown && !this.controller.isUp) {
      this.playerCharacter.getSprite().body.moveUp(400);
    } else if (this.controller.isUp) {
      this.playerCharacter.getSprite().body.moveDown(400);
    }
  }

  private createMap(): Phaser.Tilemap {
    // Initialize the physics system (P2).
    game.physics.startSystem(Phaser.Physics.P2JS);

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

    const collision: Phaser.TilemapLayer = last(layers)!;
    collision.visible = false;

    const p2 = this.game.physics.p2;
    const collisionIndex = collision.getTiles(0, 0, 1, 1)[0].index;
    map.setCollision(collisionIndex, true, collision);
    p2.convertTilemap(map, collision, true, true);
    p2.setBoundsToWorld(true, true, true, true, false);
    p2.restitution = 0.2; // Bounciness. '1' is very bouncy.
    game.worldState.setCollisionFromTilemap(map, collision);

    return map;
  }
}
