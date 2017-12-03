import Crisis from './crisis';
import CrisisEvent from './crisis_event';
import ICrisisGenerator from './crisis_generator';

export default class PeriodicCrisisGenerator implements ICrisisGenerator {
  private period: number;
  private sinceLastCrisis: number;
  private crises: Crisis[];

  constructor(period: number, crises: Crisis[]) {
    this.period = period;
    this.sinceLastCrisis = 0;
    this.crises = crises;
  }

  public tick(elapsed: number): CrisisEvent[] {
    this.sinceLastCrisis += elapsed;
    if (this.sinceLastCrisis >= this.period) {
      this.sinceLastCrisis = 0;
      if (this.crises.length > 0) {
        return [
          new CrisisEvent(
            this.crises[Math.floor(Math.random() * this.crises.length) - 1],
            5000
          ),
        ];
      }
    }
    return [];
  }
}
