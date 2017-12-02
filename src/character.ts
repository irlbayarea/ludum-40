/**
 * Character class
 * Encapsulates all information about a character
 */
import * as Phaser from 'phaser-ce';
import Crisis from './crisis/crisis';
import CrisisOption from './crisis/option';

export const minSPEED: number = 1;
export const maxSPEED: number = 10;
export const minSTR: number = 0;
export const maxSTR: number = 10;
export const minINT: number = 0;
export const maxINT: number = 10;
export const minCHA: number = 0;
export const maxCHA: number = 10;
export const minRANDO: number = -5;
export const maxRANDO: number = 10;
export const minGOOD: number = -5;
export const maxGOOD: number = 10;
export const maxSalary: number = 100;

export default class Character {
  private name: string;

  private sprite: Phaser.Sprite;

  private speed: number;

  private str: number;
  private int: number;
  private cha: number;

  private rando: number;
  private good: number;

  private isGuard: boolean;
  private salary: number;

  constructor(
    sprite: Phaser.Sprite,
    name: string = randomName(),
    speed: number = 0.5 * (maxSPEED - minSPEED) + minSPEED,
    str: number = 0.5 * (maxSTR - minSTR) + minSTR,
    int: number = 0.5 * (maxINT - minINT) + minINT,
    cha: number = 0.5 * (maxCHA - minCHA) + minCHA,
    rando: number = 0.5 * (maxRANDO - minRANDO) + minRANDO,
    good: number = 0.5 * (maxGOOD - minGOOD) + minGOOD,
    isGuard: boolean = false,
    salary: number = 0
  ) {
    this.name = name;
    this.sprite = sprite;
    this.setSpeed(speed);

    this.setStr(str);
    this.setInt(int);
    this.setCha(cha);
    this.setRando(rando);
    this.good = good;
    this.isGuard = isGuard;
    this.setSalary(salary);
  }

  public getName(): string {
    return this.name;
  }

  public getSprite(): Phaser.Sprite {
    return this.sprite;
  }

  public getSpeed(): number {
    return this.speed;
  }

  public setSpeed(speed: number) {
    if (speed > 0) {
      this.speed = speed;
    } else {
      throw new RangeError('Speed must be > 0');
    }
  }

  public getSTR(): number {
    return this.str;
  }
  public getINT(): number {
    return this.int;
  }
  public getCHA(): number {
    return this.cha;
  }
  public getRANDO(): number {
    return this.rando;
  }

  public getGOOD(): number {
    return this.good;
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

  private setStr(str: number): void {
    if (str > 0) {
      this.str = str;
    } else {
      throw new RangeError('str value must be > 0');
    }
  }

  private setInt(int: number): void {
    if (int > 0) {
      this.int = int;
    } else {
      throw new RangeError('int value must be > 0');
    }
  }

  private setCha(cha: number): void {
    if (cha > 0) {
      this.cha = cha;
    } else {
      throw new RangeError('cha value must be > 0');
    }
  }

  private setRando(rando: number): void {
    if (rando >= 0) {
      this.rando = rando;
    } else {
      throw new RangeError('rando value must be >= 0');
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

function randomName(): string {
  const YAML = require('yamljs');
  const names = YAML.load("./src/static/names.yaml");
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
    c.getSTR() * o.getSTR() +
      c.getRANDO() +
      (c.getINT() * o.getINT() + c.getRANDO()) +
      (c.getCHA() * o.getCHA() + c.getRANDO()) +
      Math.sqrt((Math.abs(c.getGOOD() + o.getGOOD()) + c.getRANDO()) ** 2)
  );
}

/**
 * randomGuard()
 */
export function randomGuard(sprite: Phaser.Sprite): Character {
  return new Character(
    sprite,
    randomName(),
    Math.random() * (maxSPEED - minSPEED) + minSPEED,
    Math.random() * (maxSTR - minSTR) + minSTR,
    Math.random() * (maxINT - minINT) + minINT,
    Math.random() * (maxCHA - minCHA) + minCHA,
    Math.random() * (maxRANDO - minRANDO) + minRANDO,
    Math.random() * (maxGOOD - minGOOD) + minGOOD,
    true,
    Math.random() * maxSalary
  );
}

console.log(randomName());
// console.log(randomGuard(new Phaser.Sprite(new Phaser.Game(),0, 0)));