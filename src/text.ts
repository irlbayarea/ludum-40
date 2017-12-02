import { Game } from 'phaser-ce';

export function renderText(game: Game, text: string, x: number, y: number) {
  game.add.text(x, y, text, { font: '15px Arial', fill: 'purple' });
}
