import * as events from '../events';
import * as common from '../common';
import { Game } from '../index';
import Crisis from '../crisis/crisis';
import Character from '../character/character';
import { Armory } from '../ui/sprites/armory';
import { SpawnConfig, randomSpawnLocation } from '../character/spawn_config';

export function registerGlobalHandlers(
  game: Game,
  globalHandlers: events.EventHandlers
): void {
  const h = globalHandlers;
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
      const config: SpawnConfig = e.value;
      game.hud = game.hud.setMessage(config.character.name + ' spawned');
      game.spawn(config);
    });
  }

  // Display prompts when contracts are available
  h.register(events.EventType.Contract, (e: events.Event) => {
    const character: Character = e.value;
    const { x, y } = randomSpawnLocation(game.worldState.grid);

    game.hud = game.hud.setQuestion(
      'Do you want to hire ' + character.name + '?',
      ['yes', 'no'],
      (option: number) => {
        game.hud = game.hud.clearQuestion();
        if (option === 1) {
          game.hud = game.hud.setMessage('You hired ' + character.name + '!');
          game.gameEvents.emit(
            events.EventType.CharacterSpawn,
            new SpawnConfig(character, new Armory(game).peonTexture(), x, y)
          );
        }
      }
    );
  });
}
