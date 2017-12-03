import * as events from '../../events';

import CharacterSpawnEvent from '../../character/character_spawn_event';
import { Game } from '../../index';
import PeriodicGenerator from '../../periodic_generator';
import { ITicker } from '../../ticker';

export default class CharacterGenerator implements ITicker {
  private periodicGenerator: PeriodicGenerator<CharacterSpawnEvent>;
  private game: Game;

  public constructor(game: Game, period: number, sprite: string) {
    this.game = game;
    this.periodicGenerator = new PeriodicGenerator<CharacterSpawnEvent>(
      period,
      (_: number) => new CharacterSpawnEvent(sprite)
    );
  }

  public tick(elapsed: number) {
    this.periodicGenerator.tick(elapsed).forEach(spawnEvent => {
      this.game.gameEvents.emit(
        events.EventType.CharacterSpawn,
        spawnEvent.spriteName
      );
    });
  }
}
