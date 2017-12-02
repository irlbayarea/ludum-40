import Event from './event';

type EventHandler = (e: Event) => void;

export default class EventHandlers {
  private eventHandlers: Map<string, EventHandler[]>;

  constructor() {
    this.eventHandlers = new Map();
  }

  public register(key: string, callback: EventHandler) {
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
    this.eventHandlers.delete(key);
  }

  public handle(event: Event) {
    if (this.eventHandlers.has(event.key)) {
      this.eventHandlers.get(event.key)!.forEach(handler => {
        handler(event);
      });
    }
  }
}
