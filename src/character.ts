/**
 * Character class
 * Encapsulates all information about a character
 */

class Character {
  private name: string;

  private speed: number;

  private x: number;
  private y: number;

  private str: number;
  private int: number;
  private cha: number;

  private isGuard: boolean;

  constructor(
    name: string,
    x: number,
    y: number,
    speed: number,
    str: number = 1,
    int: number = 1,
    cha: number = 1,
    isGuard: boolean = false
  ) {
    this.name = name;
    this.setSpeed(speed);
    this.moveTo(x, y);

    this.setStr(str);
    this.setInt(int);
    this.setCha(cha);
    this.isGuard = isGuard;
  }

  public getName(): string {
    return this.name;
  }

  public getSpeed(): number {
    return this.speed;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public setSpeed(speed: number) {
    if (speed > 0) {
      this.speed = speed;
    } else {
      throw new RangeError('Speed must be > 0');
    }
  }

  public moveBy(dx: number, dy: number): void {
    this.x = this.x + dx;
    this.y = this.y + dy;
  }

  public moveTo(x: number, y: number): void {
    if (x > 0) {
      this.x = x;
    } else {
      throw new RangeError('x value must be > 0');
    }
    if (y > 0) {
      this.y = y;
    } else {
      throw new RangeError('y value must be > 0');
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

  public getIsGuard(): boolean {
    return this.isGuard;
  }

  public handleCrisis(crisis: Crisis): boolean {
    // Logic for choosing a crisis option here
    if (this.isGuard) {
      return crisis
        .getOptions()
        [Math.floor(Math.random() * crisis.getOptions().length)].choose(this);
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
  ];

  return names[Math.floor(Math.random() * names.length)];
}
