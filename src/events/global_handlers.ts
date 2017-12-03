import * as events from '../events';
import * as common from '../common';
import * as textures from '../character/textures';

import { Game } from '../index';
import Crisis from '../crisis/crisis';
import Character from '../character/character';
import { SpawnConfig, randomSpawnLocation } from '../character/spawn_config';

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

  if (common.experiment('spawn')) {
    // Spawns a character.
    h.addListener(events.EventType.CharacterSpawn, (e: events.Event) => {
      const config: SpawnConfig = e.value;
      const sprite = game.add.sprite(
        config.x * 64,
        config.y * 64,
        config.texture
      );
      sprite.scale = new Phaser.Point(4.0, 4.0);
      game.physics.p2.enable(sprite);
      config.character.setSprite(sprite);
      game.worldState.characters.push(config.character);
    });
  }

  // Display prompts when contracts are available
  h.addListener(events.EventType.Contract, (e: events.Event) => {
    const character: Character = e.value;
    const { x, y } = randomSpawnLocation(game.worldState.grid);

    game.hud = game.hud.setQuestion(
      'Do you want to hire ' + character.name + '?',
      ['yes', 'no'],
      (option: number) => {
        game.hud = game.hud.clearQuestion();
        if (option === 1) {
          game.hud = game.hud.setMessage('You hired ' + character.name + '!');
          game.spawn(
            new SpawnConfig(character, textures.guard(game.armory), x, y)
          );
        }
      }
    );
  });
}
