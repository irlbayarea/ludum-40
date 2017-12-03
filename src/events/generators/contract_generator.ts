import * as events from '../../events';

import { Game } from '../../index';
import PeriodicGenerator from '../../periodic_generator';
import { ITicker } from '../../ticker';

export default class ContractGenerator implements ITicker {
  private periodicGenerator: PeriodicGenerator<string>;
  private game: Game;

  public constructor(game: Game, period: number, name: () => string) {
    this.game = game;
    this.periodicGenerator = new PeriodicGenerator<string>(
      period,
      (_: number) => name()
    );
  }

  public tick(elapsed: number) {
    this.periodicGenerator.tick(elapsed).forEach(name => {
      this.game.gameEvents.schedule(events.EventType.Contract, name, 1000);
    });
  }
}
