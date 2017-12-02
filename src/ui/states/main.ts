import * as Phaser from 'phaser-ce';

/**
 * Main state (i.e. in the game).
 */
export default class Main extends Phaser.State {
  private static random(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private cursors: Phaser.CursorKeys;

  private character: Phaser.Sprite;
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
    this.cursors = this.game.input.keyboard.createCursorKeys();

    // Enable physics.
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Example of the main character.
    this.character = this.game.add.sprite(0, 64 * 4, 'characters', 325);
    this.character.scale = new Phaser.Point(4.0, 4.0);

    // Example of monsters.
    for (let i = 0; i < 10; i++) {
      const monster = this.monster();
      this.monsters.push(monster);
    }
  }

  public update(): void {
    this.game.camera.follow(this.character);
    if (this.cursors.left.isDown) {
      this.character.x -= 8;
    } else if (this.cursors.right.isDown) {
      this.character.x += 8;
    }
    if (this.cursors.up.isDown) {
      this.character.y -= 8;
    } else if (this.cursors.down.isDown) {
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
