import EventQueue from './event_queue';
import EventHandlers, { EventHandler } from './event_handler';
import EventType from './event_type';
import Event from './event';
import { game } from './index';

export default class GameEvents {
  private eventQueue: EventQueue;
  private eventHandlers: EventHandlers;

  constructor() {
    this.eventQueue = new EventQueue(0);
    this.eventHandlers = new EventHandlers();
  }

  public schedule(type: EventType, value: any, delay: number) {
    this.eventQueue.add(type, value, delay);
  }

  public tick(elapsed: number) {
    const ended = this.eventQueue.tick(elapsed);
    ended.forEach((event: Event) => {
      this.eventHandlers.handle(event);
    });
  }

  public addListener(type: EventType, callback: EventHandler) {
    this.eventHandlers.register(type, callback);
  }

  public emit(type: EventType, value: any) {
    this.eventHandlers.handle(new Event(type, value, game.time.elapsedMS));
  }
}
