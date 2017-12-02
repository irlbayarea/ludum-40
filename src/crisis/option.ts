import Crisis from './crisis';
import { minGOOD } from '../character';

/**
 * CrisisOption
 * Encapsulates a game event option.
 */
export default class CrisisOption {
  private parent: Crisis;
  private description: string;
  private value: number;

  private strVal: number;
  private intVal: number;
  private chaVal: number;
  private goodVal: number;

  constructor(
    parent: Crisis,
    description: string,
    value: number,
    strVal: number = 0,
    intVal: number = 0,
    chaVal: number = 0,
    goodVal: number = 1
  ) {
    this.parent = parent;
    this.description = description;
    this.value = value;
    if (strVal >= 0) {
      this.strVal = strVal;
    } else {
      throw new RangeError('strVal must be >= 0');
    }
    if (intVal >= 0) {
      this.intVal = intVal;
    } else {
      throw new RangeError('intVal must be >= 0');
    }
    if (chaVal >= 0) {
      this.chaVal = chaVal;
    } else {
      throw new RangeError('chaVal must be >= 0');
    }
    this.goodVal = goodVal;
  }

  public getSTR(): number {
    return this.strVal;
  }

  public getINT(): number {
    return this.intVal;
  }

  public getCHA(): number {
    return this.chaVal;
  }

  public getGOOD(): number {
    return this.goodVal;
  }

  public getParent(): Crisis {
    return this.parent;
  }

  public getDescription(): string {
    return this.description;
  }

  public getValue(): number {
    return this.value;
  }
}

export function UnresolvedCrisis(crisis: Crisis): CrisisOption {
  return new CrisisOption(crisis, 'Unresolved Crisis', 0, 0, 0, 0, minGOOD);
}
