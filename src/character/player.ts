import Character from './character';

export default class Player {
  private money: number;
  private character: Character;

  constructor(name: string) {
    this.money = 0;
    this.character = new Character(name);
  }

  public getCharacter(): Character {
    return this.character;
  }

  public getMoney(): number {
    return this.money;
  }

  public modMoney(mod: number): number {
    this.money += mod;
    return this.money;
  }
}
