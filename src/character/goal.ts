import Character from './character';
import { Point } from 'phaser-ce';

/**
 * The Goals class represents the goals or behaviour of a character. Characters
 * may only have one goal at a time.
 *
 * See WorldState.updateCharacterBehaviors for implementations of goals.
 */
export default class Goal {
  // Types of goals.
  public static readonly TYPE_IDLE: number = 1;
  public static readonly TYPE_WANDER: number = 2;
  public static readonly TYPE_ATTACK_CHAR: number = 3;
  public static readonly TYPE_MOVE_TO: number = 4;
  public static readonly DEFAULT_TYPE: number = Goal.TYPE_IDLE;

  // The states that a goal can be in.
  public static readonly STATE_START: number = 1;
  public static readonly STATE_ACTIVE: number = 2;
  public static readonly STATE_DONE: number = 3;

  public static idle(): Goal {
    return new Goal(Goal.TYPE_IDLE, null, null);
  }

  public static wander(): Goal {
    return new Goal(Goal.TYPE_WANDER, null, null);
  }

  public static attack(targetCharacter: Character): Goal {
    return new Goal(Goal.TYPE_ATTACK_CHAR, targetCharacter, null);
  }

  public static moveTo(targetPoint: Point): Goal {
    return new Goal(Goal.TYPE_MOVE_TO, null, targetPoint);
  }

  public readonly type: number;
  public readonly targetChar: Character | null;
  public readonly targetPoint: Point | null;
  public state: number;

  private constructor(
    type: number,
    targetChar: Character | null,
    targetPoint: Point | null
  ) {
    this.type = type;
    this.targetChar = targetChar;
    this.targetPoint = targetPoint;
    this.state = Goal.STATE_START;
  }
}
