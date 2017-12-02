import * as Phaser from 'phaser-ce';
import Controller from '../../input/controller';
import MessagePanel from '../message';
import HutFactory from '../sprites/hut';
import { game } from '../../index';

/**
 * Main state (i.e. in the game).
 */
export default class Main extends Phaser.State {
  private static random(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private controller: Controller;
  private character: Phaser.Sprite;
  private messages: MessagePanel;
  private monsters: Phaser.Sprite[] = [];

  /**
   * Called from `create`. Initializes tilemap and physics.
   */
  private create_physics(): void {
    this.game.physics.startSystem(Phaser.Physics.P2JS);

    // Initialize tilemap.
    const map = this.game.add.tilemap('Tilemap');
    map.addTilesetImage('collision', 'collision');
    map.addTilesetImage('tiles', 'tiles');
    const layers = [
      map.createLayer('terrain'),
      map.createLayer('foreground'),
      map.createLayer('structures'),
    ];
    layers.forEach(layer => {
      layer.resizeWorld();
      layer.wrap = true;
    });
    const collisionLayer: Phaser.TilemapLayer = map.createLayer('collision');
    collisionLayer.visible = false;
    // The collision tilemap tiles are not 0 or 1 indexed. Get the starting index.
    const collisionIndex: number = collisionLayer.getTiles(0, 0, 1, 1)[0].index;
    map.setCollision(collisionIndex, true, collisionLayer);
    this.game.physics.p2.convertTilemap(map, collisionLayer, true, true);
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
    this.game.physics.p2.restitution = 0.2;  // Bounciness. 1 is very bouncy.
  }

  public create(): void {
    this.create_physics();

    // Enable keyboard.
    this.controller = new Controller(this.game);

    // Main character.
    this.character = this.game.add.sprite(0, 64 * 4, 'characters', 325);
    this.character.scale = new Phaser.Point(4.0, 4.0);
    this.game.physics.p2.enable(this.character);
    this.character.body.fixedRotation = true;
    this.game.camera.follow(this.character);

    // Example of generating a hut (at 64,64 for now).
    const hutFactory = new HutFactory(this.game);
    hutFactory.sprite(64, 64);

    // Example of monsters.
    for (let i = 0; i < 10; i++) {
      const monster = this.monster();
      this.monsters.push(monster);
    }

    // Message panel.
    this.messages = this.game.plugins.add(MessagePanel);
    this.messages.setText('🔥🔥 CRISIS! 🔥🔥');
  }

  public update(): void {
<<<<<<< HEAD
    this.character.body.setZeroVelocity();
    if (this.controller.isLeft && !this.controller.isRight) {
    	this.character.body.moveLeft(400);
=======
    this.messages.update();
    var completedEvents = game.eventQueue.tick(game.time.elapsed);
    if (completedEvents.length > 0) {
      completedEvents.forEach(event => {
        game.eventHandlers.handle(event);
      });
    }

    this.game.camera.follow(this.character);
    if (this.controller.isLeft) {
      this.character.x -= 8;
>>>>>>> 0714b4923df054c5f794971007d876ec2974cad4
    } else if (this.controller.isRight) {
    	this.character.body.moveRight(400);
    }
    if (this.controller.isDown && !this.controller.isUp) {
    	this.character.body.moveUp(400);
    } else if (this.controller.isUp) {
    	this.character.body.moveDown(400);
    }
    this.monsters.forEach(monster => {
      const p: Phaser.Point = new Phaser.Point(monster.body.x, monster.body.y);
      const p2: Phaser.Point = new Phaser.Point(this.character.body.x, this.character.body.y);
      const dir: Phaser.Point = p2.subtract(p.x, p.y).normalize().multiply(400, 400);
      monster.body.moveDown(dir.y);
      monster.body.moveRight(dir.x);
      //this.game.physics.p2.(monster, this.character, 200)
    });
  }

  private monster(): Phaser.Sprite {
    const monster = this.game.add.sprite(
      Main.random(10, 20) * 64,
      Main.random(10, 20) * 64,
      'characters',
      162
    );
    monster.scale = this.character.scale;
    this.game.physics.p2.enable(monster);
    return monster;
  }
}
