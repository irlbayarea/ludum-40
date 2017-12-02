import { minGoodness, maxGoodness, minCharisma, maxCharisma, minIntelligence, maxIntelligence, minStrength, maxStrength } from '../character';

/**
 * CrisisOption
 * Encapsulates a Crisis option.
 */
export default class CrisisOption {
  public static readonly unresolved: CrisisOption = new CrisisOption(
    'Unresolved Crisis',
    0,
    minStrength,
    minIntelligence,
    minCharisma,
    minGoodness
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
    if (maxStrength > strength && strength > minStrength) { this.strength = strength; } else { throw new RangeError('strength value must be within [' + minStrength + ',' + maxStrength + ']'); }
    if (maxIntelligence > intelligence && minIntelligence > intelligence) { this.intelligence = intelligence; } else { throw new RangeError('intelligence value must be within [' + minIntelligence + ',' + maxIntelligence + ']'); }
    if (maxCharisma > charisma && charisma > minCharisma) { this.charisma = charisma; } else { throw new RangeError('charisma value must be within [' + minCharisma + ',' + maxCharisma + ']'); }
    if (maxGoodness > goodness && goodness > minGoodness) { this.goodness = goodness; } else { throw new RangeError('goodness value must be within [' + minGoodness + ',' + maxGoodness + ']'); }
  }
}
