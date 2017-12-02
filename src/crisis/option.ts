import { minGOOD } from '../character';

/**
 * CrisisOption
 * Encapsulates a game event option.
 */
export default class CrisisOption {
  public static readonly unresolved: CrisisOption = new CrisisOption(
    'Unresolved Crisis',
    0,
    0,
    0,
    0,
    minGOOD
  );

  public readonly description: string;
  public readonly value: number;
  public readonly strength: number;
  public readonly intelligence: number;
  public readonly charisma: number;
  public readonly good: number;

  constructor(
    description: string,
    value: number,
    strVal: number = 0,
    intVal: number = 0,
    chaVal: number = 0,
    goodVal: number = 1
  ) {
    this.description = description;
    this.value = value;
    if (strVal >= 0) {
      this.strength = strVal;
    } else {
      throw new RangeError('strVal must be >= 0');
    }
    if (intVal >= 0) {
      this.intelligence = intVal;
    } else {
      throw new RangeError('intVal must be >= 0');
    }
    if (chaVal >= 0) {
      this.charisma = chaVal;
    } else {
      throw new RangeError('chaVal must be >= 0');
    }
    this.good = goodVal;
  }
}
