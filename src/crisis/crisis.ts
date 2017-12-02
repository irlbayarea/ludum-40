import Character from '../character';
import CrisisOption, { UnresolvedCrisis } from './option';

/**
 * class Event
 * Encapsulates information concerning a single event.
 */
export default class Crisis {
  public readonly description: string;

  // Score of this crisis, however it is resolved
  public readonly score: number;

  // The messenger Character who alerts other characters of this crisis
  public readonly messenger: Character;

  private options: CrisisOption[];

  // The character who resolved this crisis: either a guard or the player character
  private resolver: Character;

  // The resolution to this crisis.
  private resolution: CrisisOption;

  constructor(description: string, score: number) {
    this.description = description;
    this.score = score;

    this.options = [];
  }

  public addOption(description: string, value: number): void {
    if (!this.isResolved()) {
      this.options.push(new CrisisOption(this, description, value));
    } else {
      throw new Error('Cannot add a CrisisOption to a resolved event');
    }
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
      return UnresolvedCrisis(this);
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

  public getOptions(): CrisisOption[] {
    return this.options;
  }
}
