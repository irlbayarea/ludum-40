import Crisis from './crisis';

// A crisis and its duration, used to add a crisis to the event queue.
//
// Example: queue a crisis:
//   eventQueue.add(event.crisis, event.duration);
export default class CrisisEvent {
  public readonly crisis: Crisis;
  public readonly duration: number;

  constructor(crisis: Crisis, duration: number) {
    this.crisis = crisis;
    this.duration = duration;
  }
}
