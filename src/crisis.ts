/**
 * 
 */
class CrisisManager {

    crises: Array<Crisis>;

    constructor() {}

    addCrisis(crisis: Crisis): void {
        this.crises.push(crisis);
    }

    /**
     * 
     * @param crisis 
     * @param resolver 
     * @param choice 
     * @param time 
     */
    static resolveCrisis(crisis: Crisis, resolver: Guard, choice: CrisisOption, time: number): ResolvedCrisis {
        return new ResolvedCrisis(crisis, resolver, choice, time);
    }

}

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

    description: string;

    options: Array<CrisisOption>;

    timeLimit: number;

    baseValue: number;

    townsfolk: Character;

    constructor(description: string, options: Array<CrisisOption>, timeLimit: number, baseValue: number, townsfolk: Character) {
        this.description = description;
        this.options = options;

        this.setTimeLimit(timeLimit);

        this.baseValue = baseValue;
        this.townsfolk = townsfolk;
    }

    setTimeLimit(timeLimit: number): void {
        if (timeLimit > 0) {
            this.timeLimit = timeLimit;
        } 
        else {
            throw new RangeError("Invalid timeLimit. Must be > 0");
        }
    }

}

/**
 * GameEventOption
 * Encapsulates a game event option.
 */
class CrisisOption {

    description: string;
    value: number;

    constructor(description: string, value: number) {
        this.description = description;
        this.value = value;
    }
}

/**
 * ResolvedCrisis class
 * Encapsulates a resolved game event.
 */
class ResolvedCrisis extends Crisis {

    resolver: Guard; // The Guard / Player that resolved the event
    choice: CrisisOption;
    time: number;
    
    constructor(crisis: Crisis, resolver: Guard, choice: CrisisOption, time: number) {
        super(crisis.description, crisis.options, crisis.timeLimit, crisis.baseValue, crisis.townsfolk);
        this.resolver = resolver;
        this.choice = choice;
        this.complete(time);
    }
    
    complete(time: number) {
        if (time > 0) {
            this.time = time;
        } else {
            throw new RangeError("Did not resolve event in time > 0");
        }
    }

    score(): number {
        return 1; // will be a little more... complicated later...
    }

}