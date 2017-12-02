import Crisis from './crisis';

// The result of a crisis.
export default class CrisisResult {
  public readonly crisis: Crisis;
  public readonly timeToResolve: number;

  constructor(crisis: Crisis, timeToResolve: number) {
    this.crisis = crisis;
    this.timeToResolve = timeToResolve;
  }

  // Returns true iff the crisis was resovled.
  public wasResolved() {
    return this.crisis.isResolved();
  }

  public getResolution() {
    return this.crisis.getResolution();
  }
}
