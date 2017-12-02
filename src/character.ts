/**
 * Character class
 * Encapsulates all information about a character
 */
import * as Phaser from 'phaser-ce';
import Crisis from './crisis/crisis';
import CrisisOption from './crisis/option';

export const min_speed: number = 1;
export const max_speed: number = 10;
export const min_strength: number = 0;
export const max_strength: number = 10;
export const min_intelligence: number = 0;
export const max_intelligence: number = 10;
export const min_charisma: number = 0;
export const max_charisma: number = 10;
export const min_randomness: number = -5;
export const max_randomness: number = 10;
export const min_goodness: number = -5;
export const max_goodness: number = 10;

export const max_salary: number = 100;


export default class Character {
  private name: string;
  
  private sprite: Phaser.Sprite;
  
  public readonly speed: number;
  public readonly strength: number;
  public readonly intelligence: number;
  public readonly charisma: number;
  public readonly randomness: number;
  public readonly goodness: number;
  
  private isGuard: boolean;
  private salary: number;
  
  constructor(
    sprite: Phaser.Sprite,
    name: string = randomName(),
    speed: number = average(min_speed, max_speed),
    strength: number = average(min_strength, max_strength),
    intelligence: number = average(min_intelligence, max_intelligence),
    charisma: number = average(min_charisma, max_charisma),
    randomness: number = average(min_randomness, max_randomness),
    goodness: number = average(min_goodness, max_goodness),
    isGuard: boolean = false,
    salary: number = 0
  ) {
    this.name = name;
    this.sprite = sprite;
    
    if (max_speed > speed && speed > min_speed) { this.speed = speed; } else { throw new RangeError('speed value must be within [${min_speed},${max_speed}]'); }
    if (max_strength > strength && strength > min_strength) { this.strength = strength; } else { throw new RangeError('strength value must be within [${min_strength},${max_strength}]'); }
    if (max_intelligence > intelligence && min_intelligence > intelligence) { this.intelligence = intelligence; } else { throw new RangeError('intelligence value must be within [${min_intelligence},${max_intelligence}]'); }
    if (max_charisma > charisma && charisma > min_charisma) { this.charisma = charisma; } else { throw new RangeError('charisma value must be within [${min_charisma},${max_charisma}]'); }
    if (max_randomness > randomness && randomness > min_randomness) { this.randomness = randomness; } else { throw new RangeError('randomness value must be within [${min_randomness},${max_randomness}]'); }
    if (max_goodness > goodness && goodness > min_goodness) { this.goodness = goodness; } else { throw new RangeError('goodness value must be within [${min_goodness},${max_goodness}]'); }
    
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
function average(min:number, max:number) { return 0.5 * (max - min) + min; }

/**
 * Get a random name from a list of names in assets/lists/names.yaml
 */
export function randomName(): string {
  const YAML = require('yamljs');
  const names = YAML.load("assets/lists/names.yaml");
  return names['names'][Math.floor(Math.random() * names['names'].length)];
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
      (c.strength * o.strength + c.randomness) +
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
    Math.random() * (max_speed - min_speed) + min_speed,
    Math.random() * (max_strength - min_strength) + min_strength,
    Math.random() * (max_intelligence - min_intelligence) + min_intelligence,
    Math.random() * (max_charisma - min_charisma) + min_charisma,
    Math.random() * (max_randomness - min_randomness) + min_randomness,
    Math.random() * (max_goodness - min_goodness) + min_goodness,
    true,
    Math.random() * max_salary
  );
}

