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
  private three: Phaser.Key;
  private four: Phaser.Key;
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
    this.three = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    this.four = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
  }

  get is1(): boolean {
    return this.one.isDown;
  }

  get is2(): boolean {
    return this.two.isDown;
  }

  get is3(): boolean {
    return this.three.isDown;
  }

  get is4(): boolean {
    return this.four.isDown;
  }

  get is1JustDown(): boolean {
    return this.one.justDown;
  }

  get is2JustDown(): boolean {
    return this.two.justDown;
  }

  get is3JustDown(): boolean {
    return this.three.justDown;
  }

  get is4JustDown(): boolean {
    return this.four.justDown;
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

  get isSpaceJustDown(): boolean {
    return this.space.justDown;
  }
}
