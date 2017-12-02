/**
 * Character class
 * Encapsulates all information about a character
 */
import * as Phaser from 'phaser-ce';
import Crisis from '../crisis/crisis';
import CrisisOption from '../crisis/option';
import { randomName } from './names';

export const minSpeed: number = 1;
export const maxSpeed: number = 10;
export const minStrength: number = 0;
export const maxStrength: number = 10;
export const minIntelligence: number = 0;
export const maxIntelligence: number = 10;
export const minCharisma: number = 0;
export const maxCharisma: number = 10;
export const minRandomness: number = -5;
export const maxRandomness: number = 10;
export const minGoodness: number = -5;
export const maxGoodness: number = 10;

export const maxSalary: number = 100;

export default class Character {
  public readonly speed: number;
  public readonly strength: number;
  public readonly intelligence: number;
  public readonly charisma: number;
  public readonly randomness: number;
  public readonly goodness: number;

  private name: string;
  private sprite: Phaser.Sprite;
  private isGuard: boolean;
  private salary: number;

  constructor(
    sprite: Phaser.Sprite,
    name: string = randomName(),
    speed: number = average(minSpeed, maxSpeed),
    strength: number = average(minStrength, maxStrength),
    intelligence: number = average(minIntelligence, maxIntelligence),
    charisma: number = average(minCharisma, maxCharisma),
    randomness: number = average(minRandomness, maxRandomness),
    goodness: number = average(minGoodness, maxGoodness),
    isGuard: boolean = false,
    salary: number = 0
  ) {
    this.name = name;
    this.sprite = sprite;

    if (maxSpeed > speed && speed > minSpeed) {
      this.speed = speed;
    } else {
      throw new RangeError(
        'speed value must be within [' + minSpeed + ',' + maxSpeed + ']'
      );
    }
    if (maxStrength > strength && strength > minStrength) {
      this.strength = strength;
    } else {
      throw new RangeError(
        'strength value must be within [' +
          minStrength +
          ',' +
          maxStrength +
          ']'
      );
    }
    if (maxIntelligence > intelligence && minIntelligence > intelligence) {
      this.intelligence = intelligence;
    } else {
      throw new RangeError(
        'intelligence value must be within [' +
          minIntelligence +
          ',' +
          maxIntelligence +
          ']'
      );
    }
    if (maxCharisma > charisma && charisma > minCharisma) {
      this.charisma = charisma;
    } else {
      throw new RangeError(
        'charisma value must be within [' +
          minCharisma +
          ',' +
          maxCharisma +
          ']'
      );
    }
    if (maxGoodness > goodness && goodness > minGoodness) {
      this.goodness = goodness;
    } else {
      throw new RangeError(
        'goodness value must be within [' +
          minGoodness +
          ',' +
          maxGoodness +
          ']'
      );
    }
    if (maxRandomness > randomness && randomness > minRandomness) {
      this.randomness = randomness;
    } else {
      throw new RangeError(
        'randomness value must be within [' +
          minRandomness +
          ',' +
          maxRandomness +
          ']'
      );
    }

    this.isGuard = isGuard;
    this.setSalary(salary);
  }

  public getName(): string {
    return this.name;
  }

  public getSprite(): Phaser.Sprite {
    return this.sprite;
  }

  public getIsGuard(): boolean {
    return this.isGuard;
  }

  public getSalary(): number {
    return this.salary;
  }

  /**
   * handleCrisis
   *
   * If the crisis is being handled by a guard, perform a weighted random choice
   *
   */
  public handleCrisis(crisis: Crisis): boolean {
    if (this.isGuard) {
      if (!crisis.claim(this)) {
        return false;
      }

      const crisisProbability: number[] = [];

      for (const opt of crisis.getOptions()) {
        crisisProbability.push(scoreOption(this, opt));
      }

      let normalize: number = 0;
      for (const prob of crisisProbability) {
        normalize += prob;
      }

      const choiceVal: number = Math.random() * normalize;
      let choiceSum: number = 0;
      let i: number = 0;
      for (const prob of crisisProbability) {
        choiceSum += prob;
        if (choiceVal <= choiceSum) {
          crisis.resolve(crisis.getOptions()[i]);
          return true;
        } else {
          i++;
        }
      }

      // If we get to the end of the list without resolving the crisis, just pick the last element
      crisis.resolve(crisis.getOptions()[crisis.getOptions().length - 1]);
      return true;
    } else {
      return false;
    }
  }

  private setSalary(salary: number): void {
    if (salary >= 0) {
      this.salary = salary;
    } else {
      throw new RangeError('salary must be >= 0');
    }
  }
}

// Average function of two numbers
function average(min: number, max: number) {
  return 0.5 * (max - min) + min;
}

/**
 * If this crisis is being handled by a Guard, use the following formula to determine the
 * (relative) probability of the Guard choosing any particular option:
 * abs( (guard STR  * option STR  val + guard RANDO) +
 *      (guard CHA  * option CHA  val + guard RANDO) +
 *      (guard INT  * option INT  val + guard RANDO) +
 *      sqrt((abs(guard GOOD + option GOOD val) + guard RANDO)^2) )
 * The larger this value, the more aligned the choice is with the guard's "personality".
 */
function scoreOption(c: Character, o: CrisisOption): number {
  return Math.abs(
    c.strength * o.strength +
      c.randomness +
      (c.intelligence * o.intelligence + c.randomness) +
      (c.charisma * o.charisma + c.randomness) +
      Math.sqrt((Math.abs(c.goodness + o.goodness) + c.randomness) ** 2)
  );
}

/**
 * randomGuard()
 */
export function randomGuard(sprite: Phaser.Sprite): Character {
  return new Character(
    sprite,
    randomName(),
    Math.random() * (maxSpeed - minSpeed) + minSpeed,
    Math.random() * (maxStrength - minStrength) + minStrength,
    Math.random() * (maxIntelligence - minIntelligence) + minIntelligence,
    Math.random() * (maxCharisma - minCharisma) + minCharisma,
    Math.random() * (maxRandomness - minRandomness) + minRandomness,
    Math.random() * (maxGoodness - minGoodness) + minGoodness,
    true,
    Math.random() * maxSalary
  );
}
