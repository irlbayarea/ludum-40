import { Game } from '../../index';
import PeriodicGenerator from '../../periodic_generator';
import { ITicker } from '../../ticker';
import Character, { randomCharacter } from '../../character/character';

export default class ContractGenerator implements ITicker {
  private periodicGenerator: PeriodicGenerator<Character>;
  private game: Game;

  public constructor(game: Game, period: number) {
    this.game = game;
    this.periodicGenerator = new PeriodicGenerator<Character>(
      period,
      (_: number) => randomCharacter()
    );
  }

  public tick(elapsed: number) {
    this.periodicGenerator
      .tick(elapsed)
      // FIXME: This shouldn't be an iterable.
      .forEach(character => {
        if (!this.game.isOfferingContract) {
          this.game.offerContract(character);
        }
      });
  }
}
