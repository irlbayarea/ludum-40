import * as events from '../events';
import * as common from '../common';

import { Game } from '../index';
import Crisis from '../crisis/crisis';

export function registerGlobalHandlers(game: Game): void {
  const h = game.gameEvents;
  if (common.experiment('crisis')) {
    // Message that a crisis has started.
    h.addListener(events.EventType.CrisisStart, (e: events.Event) => {
      const crisis: Crisis = e.value;
      game.hud = game.hud.setMessage(
        '🔥🔥 CRISIS! "' + crisis.description + '" Started'
      );
    });

    // Message that a crisis has ended.
    h.addListener(events.EventType.CrisisEnd, (e: events.Event) => {
      const crisis: Crisis = e.value;
      game.hud = game.hud.setMessage('"' + crisis.description + '" Ended.');
    });
  }
}
