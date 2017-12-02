import Character from '../character/character';
/**
 * CrisisOption
 * Encapsulates a Crisis option.
 */
export default class CrisisOption {
  public static readonly unresolved: CrisisOption = new CrisisOption(
    'Unresolved Crisis',
    0,
    Character.minStrength,
    Character.minIntelligence,
    Character.minCharisma,
    Character.minGoodness
  );

  public readonly description: string;
  public readonly value: number;
  public readonly strength: number;
  public readonly intelligence: number;
  public readonly charisma: number;
  public readonly goodness: number;

  constructor(
    description: string,
    value: number,
    strength: number = 0,
    intelligence: number = 0,
    charisma: number = 0,
    goodness: number = 1
  ) {
    this.description = description;
    this.value = value;
    if (Character.maxStrength > strength && strength > Character.minStrength) {
      this.strength = strength;
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
      Character.maxIntelligence > intelligence &&
      Character.minIntelligence > intelligence
    ) {
      this.intelligence = intelligence;
    } else {
      throw new RangeError(
        'intelligence value must be within [' +
          Character.minIntelligence +
          ',' +
          Character.maxIntelligence +
          ']'
      );
    }
    if (Character.maxCharisma > charisma && charisma > Character.minCharisma) {
      this.charisma = charisma;
    } else {
      throw new RangeError(
        'charisma value must be within [' +
          Character.minCharisma +
          ',' +
          Character.maxCharisma +
          ']'
      );
    }
    if (Character.maxGoodness > goodness && goodness > Character.minGoodness) {
      this.goodness = goodness;
    } else {
      throw new RangeError(
        'goodness value must be within [' +
          Character.minGoodness +
          ',' +
          Character.maxGoodness +
          ']'
      );
    }
  }
}
