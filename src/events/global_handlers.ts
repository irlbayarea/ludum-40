import * as events from '../events';
import * as common from '../common';
import { Game } from '../index';
import Crisis from '../crisis/crisis';

export function registerGlobalHandlers(
  h: events.EventHandlers,
  game: Game
): void {
  if (common.experiment('demo-crisis')) {
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

    // Message that a character has spawned.
    h.register(events.EventType.CharacterSpawn, (e: events.Event) => {
      game.hud = game.hud.setMessage(String(e.value) + ' spawned');
      const character = game.add.sprite(0, 64 * 4, e.value, 325);
      character.scale = new Phaser.Point(4.0, 4.0);
    });
  }
}
