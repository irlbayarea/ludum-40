/**
 * class Event
 * Encapsulates information concerning a single event.
 *
 * description: string
 *  A description of the event that is unfolding.
 *
 * options: Array<string>
 *  A list of options a Character can choose from to resolve the Event
 *
 * timeLimit: number
 *  The maximum time limit that the Event has before it must be resolved
 *
 * baseValue: number
 *  Number that determines how much this event impacts the player's score
 *
 * townsfolk: Character
 *  Automatically generated Character designed to lead Player / Guard to GameEvent
 *
 */
class Crisis {
  private description: string;
  private options: CrisisOption[];
  private timeLimit: number;

  private baseValue: number;

  private townsfolk: Character;

  private resolver: Character;
  private choice: CrisisOption;

  private resolved: boolean;
  private timeStart: number;
  private timeResolved: number;

  constructor(
    description: string,
    timeLimit: number,
    baseValue: number,
    townsfolk: Character,
    timeStart: number
  ) {
    this.description = description;

    this.setTimeLimit(timeLimit);

    this.baseValue = baseValue;
    this.townsfolk = townsfolk;

    this.resolved = false;
    this.timeStart = timeStart;
  }

  public getDescription(): string {
    return this.description;
  }

  public getValue(): number {
    // This needs to get a lot more complicated
    return this.baseValue;
  }

  public getTownsfolk(): Character {
    return this.townsfolk;
  }

  public addOption(description: string, value: number): void {
    this.options.push(new CrisisOption(this, description, value));
  }

  /**
   * If a guard attempts to claim this crisis and its resolver is not null,
   * then return false.
   * Otherwise, set the resolver to the guard and its choice
   * @param guard
   * @param choice
   */
  public claim(guard: Character, choice: CrisisOption): boolean {
    if (this.resolver == null) {
      this.resolver = guard;
      this.choice = choice;
      return true;
    }
    return false;
  }

  public resolve(time: number) {
    this.timeResolved = time;
    this.resolved = true;
  }

  public getGuard(): Character {
    return this.resolver;
  }

  public isResolved(): boolean {
    return this.resolved;
  }

  public getChoice(): CrisisOption {
    return this.choice;
  }

  public getTimeToResolve(): number {
    return this.timeResolved - this.timeStart;
  }

  public getResolvedInTime(): boolean {
    return this.timeResolved - this.timeStart <= this.timeLimit;
  }

  public getOptions(): CrisisOption[] {
    return this.options;
  }

  private setTimeLimit(timeLimit: number): void {
    if (timeLimit > 0) {
      this.timeLimit = timeLimit;
    } else {
      throw new RangeError('Invalid timeLimit. Must be > 0');
    }
  }
}
