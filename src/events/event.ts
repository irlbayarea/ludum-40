import { EventType } from './event_type';

export class Event {
  public readonly type: EventType;
  public readonly value: any;
  public readonly time: number;

  constructor(type: EventType, value: any, time: number) {
    this.type = type;
    this.value = value;
    this.time = time;
  }
}
