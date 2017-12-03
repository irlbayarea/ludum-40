import * as events from '../events';

export class EventQueue {
  private time: number;
  private queue: events.Event[];
  private unscheduled: events.Event[];

  constructor(time: number) {
    this.time = time;
    this.queue = [];
    this.unscheduled = [];
  }

  // Adds e to the end of the queue.
  public add(type: events.EventType, value: any, duration: number) {
    this.unscheduled.push(new events.Event(type, value, this.time + duration));
  }

  public isEmpty(): boolean {
    return this.queue.length < 1;
  }

  // Records that the given time is the current game time and returns all
  // events that have completed.
  public tick(elapsed: number): events.Event[] {
    this.time += elapsed;
    const completed: events.Event[] = [];

    this.unscheduled.forEach(e => this.queue.push(e));
    this.unscheduled = [];

    while (!this.isEmpty() && this.isComplete(this.peek())) {
      const event = this.pop();
      // Set true end tie.
      event.time = this.time;
      completed.push(event);
    }

    return completed;
  }

  private peek(): events.Event {
    if (this.isEmpty()) {
      throw new RangeError();
    }
    return this.queue[0];
  }

  private isComplete(event: events.Event) {
    return event.time < this.time;
  }

  // Removes and returns the oldest event from the queue or undefined if the
  // queue is empty.
  private pop(): any {
    if (this.isEmpty()) {
      throw new RangeError();
    }
    return this.queue.pop();
  }
}
