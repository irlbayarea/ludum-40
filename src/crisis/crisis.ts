import Character from '../character';
import CrisisOption from './option';
import { Skip } from 'serializer.ts/Decorators';

/**
 * class Event
 * Encapsulates information concerning a single event.
 */
export default class Crisis {
  // The display label of this Crisis.
  public readonly description: string;

  // Score of this crisis, however it is resolved
  public readonly score: number;

  // The options for resolving this crisis
  public readonly options: CrisisOption[];

  @Skip() private resolution: CrisisOption;

  @Skip() private resolver: Character;

  constructor(description: string, score: number, options: CrisisOption[]) {
    this.description = description;
    this.score = score;
    this.options = options;
  }

  public resolve(resolution: CrisisOption) {
    this.resolution = resolution;
  }

  public isResolved() {
    return this.resolution !== undefined;
  }

  public getOptions() {
    return this.options;
  }

  public getResolver() {
    return this.resolver;
  }

  public getResolution() {
    return this.resolution;
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
}
