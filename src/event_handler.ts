import Event from './event';
import EventType from './event_type';

export type EventHandler = (e: Event) => void;

export default class EventHandlers {
  private eventHandlers: Map<EventType, EventHandler[]>;

  constructor() {
    this.eventHandlers = new Map();
  }

  public register(type: EventType, callback: EventHandler) {
    if (this.eventHandlers.has(type)) {
      this.eventHandlers.get(type)!.push(callback);
    } else {
      this.eventHandlers.set(type, [callback]);
    }
  }

  public unregister(type: EventType) {
    if (this.eventHandlers.has(type)) {
      this.eventHandlers.delete(type);
    }
    this.eventHandlers.delete(type);
  }

  public handle(event: Event) {
    if (this.eventHandlers.has(event.type)) {
      this.eventHandlers.get(event.type)!.forEach(handler => {
        handler(event);
      });
    }
  }
}
