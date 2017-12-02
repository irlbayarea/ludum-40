/**
 * Character class
 * Encapsulates all information about a character
 */
import * as Phaser from 'phaser-ce';
import Crisis from './crisis/crisis';
import CrisisOption from './crisis/option';
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

  constructor(
    sprite: Phaser.Sprite,
    name: string = generateName(),
    speed: number = 1,
    str: number = 1,
    int: number = 1,
    cha: number = 1,
    rando: number = 1,
    good: number = 1,
    isGuard: boolean = false
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

  /**
   * handleCrisis
   */
  public handleCrisis(crisis: Crisis): boolean {
    if (this.isGuard) {
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
          return crisis.getOptions()[i].choose(this);
        } else {
          i++;
        }
      }

      return crisis.getOptions()[crisis.getOptions().length - 1].choose(this);
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
}

function generateName(): string {
  const names: string[] = [
    'Bob',
    'Joe',
    'Bill',
    'Steve',
    'Eric',
    'Donald',
    'Jared',
    'Robert',
    'Paul',
    'Jesse',
    'Matan',
    'Kendal',
    'Porgzar',
    'Porg-Porg',
    'Jennifer',
    'Jamie',
    'Allison',
    'Stacy',
    'Kelly',
    'Brian',
    'Lisa',
    'Maria',
    'Kyle',
    'Jason',
  ];

  return names[Math.floor(Math.random() * names.length)];
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
const minSPEED: number = 1;
const maxSPEED: number = 10;
const maxSTR: number = 10;
const maxINT: number = 10;
const maxCHA: number = 10;
const maxRANDO: number = 10;
const minGOOD: number = -5;
const maxGOOD: number = 10;
function randomGuard(sprite: Phaser.Sprite): Character {
  return new Character(
    sprite,
    generateName(),
    Math.random() * (maxSPEED - minSPEED) + minSPEED,
    Math.random() * maxSTR,
    Math.random() * maxINT,
    Math.random() * maxCHA,
    Math.random() * maxRANDO,
    Math.random() * (maxGOOD - minGOOD) + minGOOD,
    true
  );
}
