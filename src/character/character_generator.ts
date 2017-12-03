import PeriodicGenerator from '../generators';
import CharacterSpawnEvent from './character_spawn_event';

export default class CharacterGenerator extends PeriodicGenerator<
  CharacterSpawnEvent
> {
  public constructor(period: number, sprite: string) {
    super(period, (_: number) => new CharacterSpawnEvent(sprite));
  }
}
