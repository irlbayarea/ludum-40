import * as events from '../events';
import * as common from '../common';
import { Game } from '../index';
import Crisis from '../crisis/crisis';

export function registerGlobalHandlers(
  h: events.EventHandlers,
  game: Game
): void {
  if (common.experiment('demo-crisis')) {
    h.register(events.EventType.CrisisStart, (e: events.Event) => {
      const crisis: Crisis = e.value;
      game.hud = game.hud.setMessage(
        '🔥🔥 CRISIS! "' + crisis.description + '" Started'
      );
    });

    h.register(events.EventType.CrisisEnd, (e: events.Event) => {
      const crisis: Crisis = e.value;
      game.hud = game.hud.setMessage('"' + crisis.description + '" Ended.');
    });
  }
}
