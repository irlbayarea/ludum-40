import * as Phaser from 'phaser-ce';

/**
 * Single input to whether to move the character (i.e. via the keyboard).
 */
export default class Controller {
  private cursors: Phaser.CursorKeys;
  private w: Phaser.Key;
  private a: Phaser.Key;
  private s: Phaser.Key;
  private d: Phaser.Key;
  private space: Phaser.Key;

  private one: Phaser.Key;
  private two: Phaser.Key;

  /**
   * Create a game controller from the current game object.
   * @param game
   */
  constructor(game: Phaser.Game) {
    this.cursors = game.input.keyboard.createCursorKeys();
    this.w = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.s = game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.d = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.one = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.two = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
  }

  get is1(): boolean {
    return this.one.isDown;
  }

  get is2(): boolean {
    return this.two.isDown;
  }

  get isUp(): boolean {
    return this.cursors.down.isDown || this.s.isDown;
  }

  get isDown(): boolean {
    return this.cursors.up.isDown || this.w.isDown;
  }

  get isLeft(): boolean {
    return this.cursors.left.isDown || this.a.isDown;
  }

  get isRight(): boolean {
    return this.cursors.right.isDown || this.d.isDown;
  }

  get isSpace(): boolean {
    return this.space.isDown;
  }
}
