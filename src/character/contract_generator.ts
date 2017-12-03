import PeriodicGenerator from '../generators';

export default class ContractGenerator extends PeriodicGenerator<String> {
  public constructor(period: number, name: () => string) {
    super(period, (_: number) => name());
  }
}
