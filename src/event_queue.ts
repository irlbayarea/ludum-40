import Event from './event';

export default class EventQueue {
  private time: number;
  private events: Event[];
  private unscheduled: Event[];

  constructor(time: number) {
    this.time = time;
    this.events = [];
    this.unscheduled = [];
  }

  // Adds e to the end of the queue.
  public add(key: string, value: any, duration: number) {
    this.unscheduled.push(
      new Event(key, value, this.time, this.time + duration)
    );
  }

  public isEmpty(): boolean {
    return this.events.length < 1;
  }

  // Records that the given time is the current game time and returns all
  // events that have completed.
  public tick(elapsed: number): Event[] {
    this.time += elapsed;
    const completed: Event[] = [];

    this.unscheduled.forEach(e => this.events.push(e));
    this.unscheduled = [];

    while (!this.isEmpty() && this.isComplete(this.peek())) {
      completed.push(this.pop());
    }

    return completed;
  }

  private peek(): Event {
    if (this.isEmpty()) {
      throw new RangeError();
    }
    return this.events[0];
  }

  private isComplete(event: Event) {
    return event.end < this.time;
  }

  // Removes and returns the oldest event from the queue or undefined if the
  // queue is empty.
  private pop(): any {
    if (this.isEmpty()) {
      throw new RangeError();
    }
    return this.events.pop();
  }
}
