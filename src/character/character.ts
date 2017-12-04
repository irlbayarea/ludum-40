/**
 * Character class
 * Encapsulates all information about a character
 */
import * as common from '../common';
import { SpriteHUD } from '../ui/sprites/hud';
import * as Phaser from 'phaser-ce';
import { randomName } from './names';
import Path from '../world_state/path';
import { Weapon } from '../ui/sprites/weapon';
import { assign, random } from 'lodash';
import Goal from './goal';

export default class Character {
  public static readonly minSpeed: number = 200;
  public static readonly maxSpeed: number = 500;
  public static readonly minStrength: number = 0;
  public static readonly maxStrength: number = 10;
  public static readonly minIntelligence: number = 0;
  public static readonly maxIntelligence: number = 10;
  public static readonly minRandomness: number = 0;
  public static readonly maxRandomness: number = 10;

  /**
   * Could be handled better, but whether it is a Goblin.
   */
  public readonly isGoblin: boolean;
  public readonly isGuard: boolean;

  public readonly speed: number;
  public readonly strength: number;
  public readonly intelligence: number;
  public readonly randomness: number;
  public readonly name: string;

  public readonly lefthanded: boolean = Math.random() > 0.5 ? true : false;

  public path: Path | null;
  public drawDebugPaths: boolean = true;
  public hud: SpriteHUD;
  public goal: Goal;

  private sprite?: Phaser.Sprite;
  private salary: number;
  private money: number = 0;

  private mWeapon: Weapon;

  constructor(
    name: string = randomName(),
    type: CharacterType,
    stats?: {
      speed?: number;
      strength?: number;
      intelligence?: number;
      randomness?: number;
      money?: number;
    }
  ) {
    const defaultStats = {
      speed: random(Character.minSpeed, Character.maxSpeed),
      strength: random(Character.minStrength, Character.maxStrength),
      intelligence: random(
        Character.minIntelligence,
        Character.maxIntelligence
      ),
      randomness: random(Character.minRandomness, Character.maxRandomness),
      money: 0,
    };
    stats = assign(defaultStats, stats);

    this.name = name;
    this.speed = stats.speed as number;
    this.strength = stats.strength as number;
    this.intelligence = stats.intelligence as number;
    this.randomness = stats.randomness as number;
    this.isGuard = type === CharacterType.Guard;
    this.isGoblin = type === CharacterType.Goblin;
    this.setSalary();
    this.path = null;
    this.goal = Goal.idle();
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
      if (this.lefthanded) {
        this.sprite.scale.x *= -1;
      }
      this.hud = new SpriteHUD(this.sprite, this.name, this.lefthanded);

      this.hud.addHealthBar();
      this.hud.addNameTag();

      if (this.mWeapon) {
        this.mWeapon.attach(sprite);
      }
    } else {
      throw new Error('Sprite already defined.');
    }
  }
  /**
   * Returns the center position of the character in world coordinates (1 tile = 1.00 distance).
   */
  public getWorldPosition(): Phaser.Point {
    return new Phaser.Point(
      this.sprite!.centerX / 64,
      this.sprite!.centerY / 64
    );
  }

  public getMoney(): number {
    return this.money;
  }

  public changeMoney(money: number) {
    return (this.money += money);
  }

  private setSalary(): void {
    this.salary =
      common.globals.gameplay.guardSalaryMultiplier *
      Math.sqrt(this.strength ** 2 + this.intelligence ** 2);
  }
}

export enum CharacterType {
  Player = 1,
  Goblin = 2,
  Guard = 3,
  Peasant = 4,
}
