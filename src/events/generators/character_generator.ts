import { Game } from '../../index';
import PeriodicGenerator from '../../periodic_generator';
import { ITicker } from '../../ticker';
import { Armory } from '../../ui/sprites/armory';
import Character from '../../character/character';
import { SpawnConfig } from '../../character/spawn_config';

export default class CharacterGenerator implements ITicker {
  private periodicGenerator: PeriodicGenerator<SpawnConfig>;
  private game: Game;

  public constructor(game: Game, period: number) {
    this.game = game;
    this.periodicGenerator = new PeriodicGenerator<SpawnConfig>(
      period - period + 100,
      (_: number) => this.generateSpawnConfig(new Armory(this.game))
    );
  }

  public tick(elapsed: number) {
    this.periodicGenerator.tick(elapsed).forEach(_ => {
      // FIXME: reenable.
      // this.game.gameEvents.emit(events.EventType.CharacterSpawn, character);
    });
  }

  private generateSpawnConfig(armory: Armory): SpawnConfig {
    // const spawnOptions = this.game.worldState.grid.getEmptyCells()
    const spawnOptions = [{ x: 100, y: 100 }, { x: 200, y: 200 }];
    const { x, y } = spawnOptions[
      Math.floor(Math.random() * spawnOptions.length) - 1
    ];

    const texture = armory.peonTexture();

    const character = new Character();
    return new SpawnConfig(character, texture, x, y);
  }
}
