import CrisisEvent from './crisis_event';

export default interface ICrisisGenerator {
  tick(elapsed: number): CrisisEvent[];
};
