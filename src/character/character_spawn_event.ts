// A crisis and its duration, used to add a crisis to the event queue.
//
// Example: queue a crisis:
//   eventQueue.add(event.crisis, event.duration);
export default class CharacterSpawnEvent {
  constructor(public readonly spriteName: string) {}
}
