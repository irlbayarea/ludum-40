import * as common from '../common';
import Crisis from './crisis';
import CrisisEvent from './crisis_event';
import PeriodicGenerator from '../generators';

export default class PeriodicCrisisGenerator extends PeriodicGenerator<
  CrisisEvent
> {
  constructor(period: number, crises: Crisis[]) {
    super(
      period,
      (_: number) =>
        new CrisisEvent(
          crises[Math.floor(Math.random() * crises.length) - 1],
          common.globals.gameplay.crisisRateMs
        )
    );
  }
}
