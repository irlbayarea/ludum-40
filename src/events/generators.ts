import * as common from '../common';

import { Game } from '../index';
import CrisisGenerator from './generators/crisis_generator';
import CrisisSerializer from '../crisis/crisis_serializer';
import { jsonCrises } from '../crisis/crises';
import ContractGenerator from './generators/contract_generator';
// import CharacterGenerator from './generators/character_generator';

export function initGenerators(game: Game) {
  // Enable event generators.
  game.generators = [
    new CrisisGenerator(
      game,
      common.globals.gameplay.crisisRateMs,
      CrisisSerializer.unserializeAll(JSON.stringify(jsonCrises))
    ),
    // Enable character events.
    // new CharacterGenerator(game, common.globals.gameplay.goblinSpawnRateMs),
    // Enable contract events.
    new ContractGenerator(game, common.globals.gameplay.contractRateMs),
  ];
}
