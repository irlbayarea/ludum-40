/**
 * Character class
 * Encapsulates all information about a character
 */
import { SpriteHUD } from '../ui/sprites/hud';
import * as Phaser from 'phaser-ce';
import Crisis from '../crisis/crisis';
import CrisisOption from '../crisis/option';
import { randomName } from './names';
import Path from '../world_state/path';
import { Weapon } from '../ui/sprites/weapon';
import { assign } from 'lodash';

export default class Character {
  public static readonly minSpeed: number = 10;
  public static readonly maxSpeed: number = 500;
  public static readonly minStrength: number = 0;
  public static readonly maxStrength: number = 10;
  public static readonly minIntelligence: number = 0;
  public static readonly maxIntelligence: number = 10;
  public static readonly minCharisma: number = 0;
  public static readonly maxCharisma: number = 10;
  public static readonly minRandomness: number = -5;
  public static readonly maxRandomness: number = 10;
  public static readonly minGoodness: number = -5;
  public static readonly maxGoodness: number = 10;

  /**
   * Could be handled better, but whether it is a Goblin.
   */
  public readonly isGoblin: boolean;

  public readonly speed: number;
  public readonly strength: number;
  public readonly intelligence: number;
  public readonly charisma: number;
  public readonly randomness: number;
  public readonly goodness: number;
  public readonly name: string;

  public path: Path | null;
  public hud: SpriteHUD;

  private wandering: boolean;
  private sprite?: Phaser.Sprite;
  private isGuard: boolean;
  private salary: number;

  private mWeapon: Weapon;

  constructor(
    name: string = randomName(),
    type: CharacterType,
    stats?: {
      speed: number;
      strength: number;
      intelligence: number;
      charisma: number;
      randomness: number;
      goodness: number;
    }
  ) {
    const defaultStats = {
      speed: average(Character.minSpeed, Character.maxSpeed),
      strength: average(Character.minStrength, Character.maxStrength),
      intelligence: average(
        Character.minIntelligence,
        Character.maxIntelligence
      ),
      charisma: average(Character.minCharisma, Character.maxCharisma),
      randomness: average(Character.minRandomness, Character.maxRandomness),
      goodness: average(Character.minGoodness, Character.maxGoodness),
    };
    stats = assign(defaultStats, stats);

    this.name = name;

    if (
      Character.maxSpeed >= stats.speed &&
      stats.speed >= Character.minSpeed
    ) {
      this.speed = stats.speed;
    } else {
      throw new RangeError(
        'speed value must be within [' +
          Character.minSpeed +
          ',' +
          Character.maxSpeed +
          ']'
      );
    }
    if (
      Character.maxStrength >= stats.strength &&
      stats.strength >= Character.minStrength
    ) {
      this.strength = stats.strength;
    } else {
      throw new RangeError(
        'strength value must be within [' +
          Character.minStrength +
          ',' +
          Character.maxStrength +
          ']'
      );
    }
    if (
      Character.maxIntelligence >= stats.intelligence &&
      stats.intelligence >= Character.minIntelligence
    ) {
      this.intelligence = stats.intelligence;
    } else {
      throw new RangeError(
        'intelligence value must be within [' +
          Character.minIntelligence +
          ',' +
          Character.maxIntelligence +
          ']'
      );
    }
    if (
      Character.maxCharisma >= stats.charisma &&
      stats.charisma >= Character.minCharisma
    ) {
      this.charisma = stats.charisma;
    } else {
      throw new RangeError(
        'charisma value must be within [' +
          Character.minCharisma +
          ',' +
          Character.maxCharisma +
          ']'
      );
    }
    if (
      Character.maxGoodness >= stats.goodness &&
      stats.goodness >= Character.minGoodness
    ) {
      this.goodness = stats.goodness;
    } else {
      throw new RangeError(
        'goodness value must be within [' +
          Character.minGoodness +
          ',' +
          Character.maxGoodness +
          ']'
      );
    }
    if (
      Character.maxRandomness >= stats.randomness &&
      stats.randomness >= Character.minRandomness
    ) {
      this.randomness = stats.randomness;
    } else {
      throw new RangeError(
        'randomness value must be within [' +
          Character.minRandomness +
          ',' +
          Character.maxRandomness +
          ']'
      );
    }

    this.isGuard = type === CharacterType.Guard;
    this.isGoblin = type === CharacterType.Goblin;
    this.setSalary();
    this.path = null;
  }

  public arm(weapon: Weapon): void {
    this.mWeapon = weapon;
    if (this.sprite) {
      weapon.attach(this.sprite);
    }
  }

  public swing(): void {
    this.weapon.markInUse();
  }

  get isArmed(): boolean {
    return this.weapon != null;
  }

  get isAttacking(): boolean {
    return this.isArmed && this.weapon.isSwinging;
  }

  get weapon(): Weapon {
    return this.mWeapon;
  }

  public wander() {
    this.wandering = true;
  }

  public stopWandering() {
    this.wandering = false;
  }

  public isWandering(): boolean {
    return this.wandering;
  }

  public getName(): string {
    return this.name;
  }

  public getSprite(): Phaser.Sprite {
    return this.sprite as Phaser.Sprite;
  }

  public getIsGuard(): boolean {
    return this.isGuard;
  }

  public getSalary(): number {
    return this.salary;
  }

  public setSprite(sprite: Phaser.Sprite) {
    if (!this.sprite) {
      this.sprite = sprite;
      this.hud = new SpriteHUD(this);
      if (this.mWeapon) {
        this.mWeapon.attach(sprite);
      }
    } else {
      throw new Error('Sprite already defined.');
    }
  }
  /**
   * Returns the position of the character in world coordinates (1 tile = 1.00 distance).
   */
  public getWorldPosition(): Phaser.Point {
    return new Phaser.Point(this.sprite!.x / 64, this.sprite!.y / 64);
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

  private setSalary(): void {
    this.salary = Math.sqrt(
      this.strength ** 2 +
        this.intelligence ** 2 +
        this.charisma ** 2 +
        this.goodness ** 2
    );
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

export enum CharacterType {
  Player = 1,
  Goblin = 2,
  Guard = 3,
  Peasant = 4,
}

/**
 * randomGuard()
 */
export function randomCharacter(type: CharacterType): Character {
  return new Character(randomName(), type, {
    speed:
      Math.random() * (Character.maxSpeed - Character.minSpeed) +
      Character.minSpeed,
    strength:
      Math.random() * (Character.maxStrength - Character.minStrength) +
      Character.minStrength,
    intelligence:
      Math.random() * (Character.maxIntelligence - Character.minIntelligence) +
      Character.minIntelligence,
    charisma:
      Math.random() * (Character.maxCharisma - Character.minCharisma) +
      Character.minCharisma,
    randomness:
      Math.random() * (Character.maxRandomness - Character.minRandomness) +
      Character.minRandomness,
    goodness:
      Math.random() * (Character.maxGoodness - Character.minGoodness) +
      Character.minGoodness,
  });
}
