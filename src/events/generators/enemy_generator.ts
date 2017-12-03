import * as events from '../../events';
import * as textures from '../../character/textures';

import { Game } from '../../index';
import PeriodicGenerator from '../../periodic_generator';
import { ITicker } from '../../ticker';
import { Armory } from '../../ui/sprites/armory';
import Character from '../../character/character';
import { SpawnConfig, randomSpawnLocation } from '../../character/spawn_config';

export default class EnemyGenerator implements ITicker {
  private periodicGenerator: PeriodicGenerator<SpawnConfig>;
  private game: Game;

  public constructor(game: Game, period: number) {
    this.game = game;
    this.periodicGenerator = new PeriodicGenerator<SpawnConfig>(
      period,
      (_: number) => this.generateSpawnConfig(new Armory(this.game))
    );
  }

  public tick(elapsed: number) {
    this.periodicGenerator.tick(elapsed).forEach(character => {
      this.game.gameEvents.emit(events.EventType.CharacterSpawn, character);
    });
  }

  private generateSpawnConfig(armory: Armory): SpawnConfig {
    const { x, y } = randomSpawnLocation(this.game.worldState.grid);
    const texture = textures.goblin(armory);
    const character = new Character();
    return new SpawnConfig(character, texture, x, y);
  }
}
