import * as Phaser from 'phaser-ce';
import Controller from '../../input/controller';
// import MessagePanel from '../message';
// import BloodFactory from '../sprites/blood';
import HutFactory from '../sprites/hut';
// import { game } from '../../index';

/**
 * Main state (i.e. in the game).
 */
export default class Main extends Phaser.State {
  // private static random(min: number, max: number): number {
  //   min = Math.ceil(min);
  //   max = Math.floor(max);
  //   return Math.floor(Math.random() * (max - min)) + min;
  // }

  private controller: Controller;
  private character: Phaser.Sprite;
  // private messages: MessagePanel;
  private monsters: Phaser.Sprite[] = [];
  // private alwaysOnTop: Phaser.Group;

  // private bloodFactory: BloodFactory;

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

    // Example of generating a hut (at 64,64 for now), and blood.
    const hutFactory = new HutFactory(this.game);
    hutFactory.sprite(64, 64);

    // this.bloodFactory = new BloodFactory(this.game);

    // Example of monsters.
    // setInterval(() => {
    //   const monster = this.monster();
    //   this.monsters.push(monster);
    // }, 300);

    // Message panel.
    // this.alwaysOnTop = this.game.add.group();
    // this.messages = this.game.plugins.add(MessagePanel, this.alwaysOnTop);
    // this.messages.setText('🔥🔥 CRISIS! 🔥🔥');
  }

  public update(): void {
    // this.messages.update();
    // const completedEvents = game.eventQueue.tick(game.time.elapsed);
    // if (completedEvents.length > 0) {
    //   completedEvents.forEach(event => {
    //     game.eventHandlers.handle(event);
    //   });
    // }
    
    this.character.body.setZeroVelocity();
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
    this.monsters.forEach(monster => {
      // Monster movement.
      const p: Phaser.Point = new Phaser.Point(monster.body.x, monster.body.y);
      const p2: Phaser.Point = new Phaser.Point(this.character.body.x, this.character.body.y);
      const dir: Phaser.Point = p2.subtract(p.x, p.y).normalize().multiply(400, 400);
      monster.body.moveDown(dir.y);
      monster.body.moveRight(dir.x);
    });

    // if (this.controller.isSpace) {
    //   const distance = this.game.physics.arcade.distanceBetween;
    //   this.monsters
    //     .filter(monster => {
    //       return distance(monster, this.character) <= 64 * 1.5;
    //     })
    //     .forEach(monster => {
    //       monster.damage(1);
    //       this.bloodFactory.sprite(monster);
    //     });
    //   this.monsters = this.monsters.filter(monster => monster.health > 0);
    // }
    // this.game.world.bringToTop(this.alwaysOnTop);
  }

  // private monster(): Phaser.Sprite {
  //   let x: number;
  //   let y: number;
  //   if (Main.random(0, 2) === 1) {
  //     x = Main.random(
  //       this.character.x - this.game.camera.width * 2,
  //       this.character.x - this.game.camera.width
  //     );
  //   } else {
  //     x = Main.random(
  //       this.character.x + this.game.camera.width * 2,
  //       this.character.x + this.game.camera.width
  //     );
  //   }
  //   if (Main.random(0, 2) === 1) {
  //     y = Main.random(
  //       this.character.y - this.game.camera.height * 2,
  //       this.character.y - this.game.camera.height
  //     );
  //   } else {
  //     y = Main.random(
  //       this.character.y + this.game.camera.height * 2,
  //       this.character.y + this.game.camera.height
  //     );
  //   }
  //   const monster = this.game.add.sprite(x, y, 'characters', 162);
  //   monster.scale = this.character.scale;
  //   return monster;
  // }
}
