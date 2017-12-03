import Character from '../character/character';
import { Skip, Type } from 'serializer.ts/Decorators';
import CrisisOption from './option';

/**
 * class Event
 * Encapsulates information concerning a single event.
 */
export default class Crisis {
  // The display label of this Crisis.
  public readonly description: string;

  // Score of this crisis, however it is resolved

  // The options for resolving this crisis
  @Type(() => CrisisOption)
  public readonly options: CrisisOption[];

  // The messenger Character who alerts other characters of this crisis
  @Skip() private resolution: CrisisOption;

  // The character who resolved this crisis: either a guard or the player character
  @Skip() private resolver: Character;

  private readonly score: number;

  constructor(description: string, score: number, options: CrisisOption[]) {
    this.description = description;
    this.score = score;
    this.options = options;
  }

  public resolve(resolution: CrisisOption) {
    if (!this.isResolved()) {
      this.resolution = resolution;
    } else {
      throw new Error('Cannot resolve a Crisis that has already been resolved');
    }
  }

  public isResolved() {
    return this.resolution !== undefined;
  }

  // FIXME: delete
  public getOptions() {
    return this.options;
  }

  public getResolver() {
    if (this.isResolved()) {
      return this.resolver;
    } else {
      throw new Error('Cannot get resolver for an unresolved Crisis');
    }
  }

  public getResolution() {
    if (this.isResolved()) {
      return this.resolution;
    } else {
      return CrisisOption.unresolved;
    }
  }

  /**
   * Claims this crisis iff it is unclaimed.
   *
   * Returns true on success, false otherwise.
   *
   * @param character  The character attempting to claim this crisis.
   */
  public claim(character: Character): boolean {
    if (this.resolver == null) {
      this.resolver = character;
      return true;
    }
    return false;
  }

  /**
   * Score a crisis
   */
  public getScore(): number {
    let actualScore = this.score;

    actualScore += this.resolver.strength * this.resolution.strength;
    actualScore += this.resolver.intelligence * this.resolution.intelligence;
    actualScore += this.resolver.charisma * this.resolution.charisma;

    actualScore +=
      Math.sign(this.resolver.goodness) *
      this.resolver.goodness *
      this.resolution.goodness;

    return actualScore;
  }
}
