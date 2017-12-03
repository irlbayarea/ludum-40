import * as events from '../events';
import * as common from '../common';
import { Game } from '../index';
import Crisis from '../crisis/crisis';
import UserQuestion from '../user_question';

export function registerGlobalHandlers(
  h: events.EventHandlers,
  game: Game
): void {
  if (common.experiment('crisis')) {
    // Message that a crisis has started.
    h.register(events.EventType.CrisisStart, (e: events.Event) => {
      const crisis: Crisis = e.value;
      game.hud = game.hud.setMessage(
        '🔥🔥 CRISIS! "' + crisis.description + '" Started'
      );
    });

    // Message that a crisis has ended.
    h.register(events.EventType.CrisisEnd, (e: events.Event) => {
      const crisis: Crisis = e.value;
      game.hud = game.hud.setMessage('"' + crisis.description + '" Ended.');
    });
  }

  if (common.experiment('spawn')) {
    // Message that a character has spawned.
    h.register(events.EventType.CharacterSpawn, (e: events.Event) => {
      game.hud = game.hud.setMessage(String(e.value) + ' spawned');
      const character = game.add.sprite(0, 64 * 4, e.value, 325);
      character.scale = new Phaser.Point(4.0, 4.0);
    });
  }

  // Display prompts when contracts are available
  h.register(events.EventType.Contract, (e: events.Event) => {
    const name: string = e.value;
    game.hud = game.hud.setQuestion(
      new UserQuestion(
        'Do you want to hire ' + name + '?',
        ['yes', 'no'],
        (option: number) => {
          game.hud = game.hud.setQuestion(null);
          if (option === 0) {
            game.hud = game.hud.setMessage('You hired ' + name + '!');
          }
        }
      )
    );
  });
}
