import * as common from '../../common';
import * as events from '../../events';

import Crisis from '../../crisis/crisis';
import PeriodicGenerator from '../../periodic_generator';
import { ITicker } from '../../ticker';
import CrisisEvent from '../../crisis/crisis_event';
import { Game } from '../../index';

export default class CrisisGenerator implements ITicker {
  private periodicGenerator: PeriodicGenerator<CrisisEvent>;
  private game: Game;

  constructor(game: Game, period: number, crises: Crisis[]) {
    this.game = game;
    this.periodicGenerator = new PeriodicGenerator<CrisisEvent>(
      period,
      (_: number) =>
        new CrisisEvent(
          crises[Math.floor(Math.random() * crises.length) - 1],
          common.globals.gameplay.crisisRateMs
        )
    );
  }

  public tick(elapsed: number) {
    this.periodicGenerator.tick(elapsed).forEach((e: CrisisEvent) => {
      this.game.gameEvents.emit(events.EventType.CrisisStart, e.crisis);
      this.game.gameEvents.schedule(
        events.EventType.CrisisEnd,
        e.crisis,
        e.duration
      );
    });
  }
}
