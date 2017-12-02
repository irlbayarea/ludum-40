class GameEventManager {

    player: Character;
    guards: Array<Character>;
    
    unresolvedEvents: Array<GameEvent>;
    resolvedEvents: Array<ResolvedEvent>;

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
class GameEvent {

    description: string;

    options: Array<string>;

    timeLimit: number;

    baseValue: number;

    townsfolk: Character;

    constructor(description: string, options: Array<string>, timeLimit: number, baseValue: number) {
        this.description = description;
        this.options = options;

        this.setTimeLimit(timeLimit);
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

class ResolvedGameEvent {

    resolver: Character;

    baseEvent: GameEvent;

    completionTime: number;

    score: number; // This should be a function?

}