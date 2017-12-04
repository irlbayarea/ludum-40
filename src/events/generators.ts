import * as common from '../common';

import { Game } from '../index';
import CrisisGenerator from './generators/crisis_generator';
import CrisisSerializer from '../crisis/crisis_serializer';
import { jsonCrises } from '../crisis/crises';

export function initGenerators(game: Game) {
  // Enable event generators.
  game.generators = [
    new CrisisGenerator(
      game,
      common.globals.gameplay.crisisRateMs,
      CrisisSerializer.unserializeAll(JSON.stringify(jsonCrises))
    ),
  ];
}
