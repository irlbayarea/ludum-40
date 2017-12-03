import Character from './character';

export default class Player {
  private money: number;
  private popularity: number;
  private character: Character;

  constructor(name: string) {
    this.money = 100;
    this.popularity = 100;
    this.character = new Character(name);
  }

  public getCharacter(): Character {
    return this.character;
  }

  public getMoney(): number {
    return this.money;
  }

  public getPopularity(): number {
    return this.popularity;
  }

  public modMoney(mod: number): number {
    this.money += mod;
    return this.money;
  }

  public modPopularity(mod: number): number {
    this.popularity += mod;
    return this.popularity;
  }
}
