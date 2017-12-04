import * as Phaser from 'phaser-ce';

/**
 * Boot state (loading the game).
 */
export default class Boot extends Phaser.State {
  public init(): void {
    this.stage.backgroundColor = '#000';
  }

  public preload(): void {
    // Load collision tiles.
    this.load.spritesheet(
      'collision',
      require('assets/sprites/collision.png'),
      64,
      64,
      2
    );

    // RPG spritesheet.
    this.load.spritesheet(
      'tiles',
      require('assets/sprites/rpg-sheet.png'),
      64,
      64
    );

    // Load blood sprays.
    this.load.spritesheet(
      'blood',
      require('assets/sprites/blood.png'),
      512,
      512
    );

    // Load explosions.
    this.load.spritesheet(
      'explode',
      require('assets/sprites/explosions.png'),
      80,
      460 / 5
    );

    // Load the character sheet.
    this.load.spritesheet(
      'characters',
      require('assets/sprites/rogue-like-characters.png'),
      16,
      16,
      616,
      undefined,
      1
    );

    // Load a simple default map.
    this.game.load.tilemap(
      'Tilemap',
      require('assets/maps/default.json'),
      null,
      Phaser.Tilemap.TILED_JSON
    );

    // Load BG Music.
    this.load.audio('music', require('assets/audio/background.ogg'));

    // Load Sounds:
    this.load.audio('sword1', require('assets/audio/sword1.ogg'));
    this.load.audio('sword2', require('assets/audio/sword2.ogg'));
    this.load.audio('sword3', require('assets/audio/sword3.ogg'));
    this.load.audio('sword4', require('assets/audio/sword4.ogg'));
    this.load.audio('sword5', require('assets/audio/sword5.ogg'));
  }

  public render(): void {
    this.state.start('Main');
  }
}
