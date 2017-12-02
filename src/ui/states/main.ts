import * as Phaser from 'phaser-ce';

import Controller from '../../input/controller';
<<<<<<< HEAD
import HutFactory from '../sprites/hut';
=======
>>>>>>> master
import MessagePanel from '../message';

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
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Example of the main character.
    this.character = this.game.add.sprite(0, 64 * 4, 'characters', 325);
    this.character.scale = new Phaser.Point(4.0, 4.0);

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
    this.messages.update();
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
    this.monsters.forEach(monster =>
      this.game.physics.arcade.moveToObject(monster, this.character, 200)
    );
  }

  private monster(): Phaser.Sprite {
    const monster = this.game.add.sprite(
      Main.random(10, 20) * 64,
      Main.random(10, 20) * 64,
      'characters',
      162
    );
    monster.scale = this.character.scale;
    this.game.physics.enable(monster, Phaser.Physics.ARCADE);
    return monster;
  }
}
