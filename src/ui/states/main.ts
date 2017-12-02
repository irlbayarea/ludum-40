import * as Phaser from 'phaser-ce';
import Controller from '../../input/controller';
import MessagePanel from '../message';
import BloodFactory from '../sprites/blood';
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
  private alwaysOnTop: Phaser.Group;

  private bloodFactory: BloodFactory;

  public create(): void {
    const map = this.game.add.tilemap('Tilemap');
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

    // Enable keyboard.
    this.controller = new Controller(this.game);

    // Enable physics.
    this.game.physics.startSystem(Phaser.Physics.P2JS);

    // Example of the main character.
    this.character = this.game.add.sprite(0, 64 * 4, 'characters', 325);
    this.character.scale = new Phaser.Point(4.0, 4.0);

    // Example of generating a hut (at 64,64 for now), and blood.
    const hutFactory = new HutFactory(this.game);
    hutFactory.sprite(64, 64);

    this.bloodFactory = new BloodFactory(this.game);

    // Example of monsters.
    setInterval(() => {
      const monster = this.monster();
      this.monsters.push(monster);
    }, 300);

    // Message panel.
    this.alwaysOnTop = this.game.add.group();
    this.messages = this.game.plugins.add(MessagePanel, this.alwaysOnTop);
    this.messages.setText('🔥🔥 CRISIS! 🔥🔥');
  }

  public update(): void {
    this.messages.update();
    const completedEvents = game.eventQueue.tick(game.time.elapsed);
    if (completedEvents.length > 0) {
      completedEvents.forEach(event => {
        game.eventHandlers.handle(event);
      });
    }

    this.game.camera.follow(this.character);
    if (this.controller.isLeft) {
      this.character.x -= 8;
    } else if (this.controller.isRight) {
      this.character.x += 8;
    }
    if (this.controller.isDown) {
      this.character.y -= 8;
    } else if (this.controller.isUp) {
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
    }
    this.monsters.forEach(monster =>
      this.game.physics.arcade.moveToObject(monster, this.character, 200)
    );
    this.game.world.bringToTop(this.alwaysOnTop);
  }

  private monster(): Phaser.Sprite {
    let x: number;
    let y: number;
    if (Main.random(0, 2) === 1) {
      x = Main.random(
        this.character.x - this.game.camera.width * 2,
        this.character.x - this.game.camera.width
      );
    } else {
      x = Main.random(
        this.character.x + this.game.camera.width * 2,
        this.character.x + this.game.camera.width
      );
    }
    if (Main.random(0, 2) === 1) {
      y = Main.random(
        this.character.y - this.game.camera.height * 2,
        this.character.y - this.game.camera.height
      );
    } else {
      y = Main.random(
        this.character.y + this.game.camera.height * 2,
        this.character.y + this.game.camera.height
      );
    }
    const monster = this.game.add.sprite(x, y, 'characters', 162);
    monster.scale = this.character.scale;
    this.game.physics.arcade.enable(monster);
    return monster;
  }
}
