import Character from '../character';
import CrisisOption from './option';

/**
 * class Event
 * Encapsulates information concerning a single event.
 */
export default class Crisis {
  public readonly description: string;

  // Score of this crisis, however it is resolved
  public readonly score: number;
  // The messenger who alerts other characters of this crisis
  public readonly messenger: Character;

  private options: CrisisOption[];

  // The character who resolved this crisis.
  private resolver: Character;

  // The resolution to this crisis.
  private resolution: CrisisOption;

  constructor(description: string, score: number) {
    this.description = description;
    this.score = score;

    this.options = [];
  }

  public addOption(description: string, value: number): void {
    this.options.push(new CrisisOption(this, description, value));
  }

  public resolve(resolution: CrisisOption) {
    this.resolution = resolution;
  }

  public isResolved() {
    return this.resolution !== undefined;
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

  public getOptions(): CrisisOption[] {
    return this.options;
  }
}
