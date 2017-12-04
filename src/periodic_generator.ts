import { ITicker } from './ticker';

export default class PeriodicGenerator<T> implements ITicker {
  private period: number;
  private sinceLastCrisis: number;
  private generate: (time: number) => T;

  constructor(period: number, generate: (time: number) => T) {
    this.period = period;
    this.sinceLastCrisis = 0;
    this.generate = generate;
  }

  public tick(elapsed: number): T[] {
    this.sinceLastCrisis += elapsed;
    if (this.sinceLastCrisis >= this.period) {
      this.sinceLastCrisis = 0;
      return [this.generate(this.sinceLastCrisis)];
    }
    return [];
  }

  public force() : T[] {
    return [this.generate(this.sinceLastCrisis)];
  }
}
