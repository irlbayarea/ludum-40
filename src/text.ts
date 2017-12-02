import { Game } from 'phaser-ce';
import { game } from './index';

// Writes the given speech as if the given character said it.
// FIXME: Use character class when present.
export function speak(character: any, speech: string) {
    renderText(game, speech, character.getX(), character.getY() - 10)
}

function renderText(game: Game, text: string, x: number, y: number) {
  game.add.text(x, y, text, { font: '15px Arial', fill: 'purple' });
}

