import * as textures from '../../character/textures';

import { Game } from '../../index';
import PeriodicGenerator from '../../periodic_generator';
import { ITicker } from '../../ticker';
import { Armory } from '../../ui/sprites/armory';
import Character, { CharacterType } from '../../character/character';
import { SpawnConfig, randomSpawnLocation } from '../../character/spawn_config';
import { Weapon } from '../../ui/sprites/weapon';

export default class EnemyGenerator implements ITicker {
  private periodicGenerator: PeriodicGenerator<SpawnConfig>;
  private game: Game;

  public constructor(game: Game, period: number) {
    this.game = game;
    this.periodicGenerator = new PeriodicGenerator<SpawnConfig>(
      period,
      (_: number) => this.generateSpawnConfig(game.armory)
    );
  }

  public tick(elapsed: number) {
    this.periodicGenerator.tick(elapsed).forEach(spawnConfig => {
      this.game.spawn(spawnConfig);
    });
  }

  private generateSpawnConfig(armory: Armory): SpawnConfig {
    const { x, y } = randomSpawnLocation(this.game.worldState.grid);
    const texture = textures.goblin(armory);
    const character = new Character('Goblin', CharacterType.Goblin);
    character.arm(Weapon.axe());
    return new SpawnConfig(character, texture, x, y);
  }
}
