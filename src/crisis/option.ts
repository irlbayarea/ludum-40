import { min_goodness, max_goodness, min_charisma, max_charisma, min_intelligence, max_intelligence, min_strength, max_strength } from '../character';

/**
 * CrisisOption
 * Encapsulates a Crisis option.
 */
export default class CrisisOption {
  public static readonly unresolved: CrisisOption = new CrisisOption(
    'Unresolved Crisis',
    0,
    min_strength,
    min_intelligence,
    min_charisma,
    min_goodness
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
    if (max_strength > strength && strength > min_strength) { this.strength = strength; } else { throw new RangeError('strength value must be within [${min_strength},${max_strength}]'); }
    if (max_intelligence > intelligence && min_intelligence > intelligence) { this.intelligence = intelligence; } else { throw new RangeError('intelligence value must be within [${min_intelligence},${max_intelligence}]'); }
    if (max_charisma > charisma && charisma > min_charisma) { this.charisma = charisma; } else { throw new RangeError('charisma value must be within [${min_charisma},${max_charisma}]'); }
    if (max_goodness > goodness && goodness > min_goodness) { this.goodness = goodness; } else { throw new RangeError('goodness value must be within [${min_goodness},${max_goodness}]'); }

  }
}
