import * as events from '../events';

export type EventHandler = (e: events.Event) => void;

export class EventHandlers {
  private eventHandlers: Map<events.EventType, EventHandler[]>;

  constructor() {
    this.eventHandlers = new Map();
  }

  public register(type: events.EventType, callback: events.EventHandler) {
    if (this.eventHandlers.has(type)) {
      this.eventHandlers.get(type)!.push(callback);
    } else {
      this.eventHandlers.set(type, [callback]);
    }
  }

  public unregister(type: events.EventType) {
    if (this.eventHandlers.has(type)) {
      this.eventHandlers.delete(type);
    }
    this.eventHandlers.delete(type);
  }

  public handle(event: events.Event) {
    if (this.eventHandlers.has(event.type)) {
      this.eventHandlers.get(event.type)!.forEach(handler => {
        handler(event);
      });
    }
  }
}
