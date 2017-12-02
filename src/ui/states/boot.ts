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

    // Load the character sheet.
    this.load.spritesheet(
      'characters',
      require('assets/sprites/rogue-like-characters.png'),
      16,
      16,
      undefined,
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

    // UI elements.
    this.load.image('panel.blue', require('assets/images/panel_blue.png'));
  }

  public render(): void {
    this.state.start('Main');
  }
}
