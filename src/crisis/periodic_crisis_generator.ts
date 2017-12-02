import Crisis from './crisis';
import CrisisEvent from './crisis_event';
import ICrisisGenerator from './crisis_generator';

export default class PeriodicCrisisGenerator implements ICrisisGenerator {
  private period: number;
  private sinceLastCrisis: number;

  constructor(period: number) {
    this.period = period;
    this.sinceLastCrisis = 0;
  }

  public tick(elapsed: number): CrisisEvent[] {
    this.sinceLastCrisis += elapsed;
    if (this.sinceLastCrisis >= this.period) {
      this.sinceLastCrisis = 0;
      const crisis = new Crisis('test-crisis-' + elapsed, 100, []);
      return [new CrisisEvent(crisis, 100)];
    }
    return [];
  }
}
