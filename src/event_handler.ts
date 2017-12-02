import Event from './event';

type EventHandler = (e: Event) => void;

export default class EventHandlers {
  private eventHandlers: Map<Event, EventHandler[]>;

  constructor() {
    this.eventHandlers = new Map();
  }

  public register(key: any, callback: EventHandler) {
    if (this.eventHandlers.has(key)) {
      this.eventHandlers.get(key)!.push(callback);
    } else {
      this.eventHandlers.set(key, [callback]);
    }
  }

  public unregister(key: any) {
    if (this.eventHandlers.has(key)) {
      this.eventHandlers.delete(key);
    }
  }

  public handle(event: Event) {
    if (this.eventHandlers.has(event.value)) {
      this.eventHandlers.get(event.value)!.forEach(handler => {
        handler(event);
      });
    }
  }
}
