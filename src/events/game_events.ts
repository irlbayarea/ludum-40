import * as events from '../events';
import { game } from '../index';

export class GameEvents {
  private eventQueue: events.EventQueue;
  private eventHandlers: events.EventHandlers;

  constructor() {
    this.eventQueue = new events.EventQueue(0);
    this.eventHandlers = new events.EventHandlers();
  }

  public schedule(type: events.EventType, value: any, delay: number) {
    this.eventQueue.add(type, value, delay);
  }

  public tick(elapsed: number) {
    const ended = this.eventQueue.tick(elapsed);
    ended.forEach((event: events.Event) => {
      this.eventHandlers.handle(event);
    });
  }

  public addListener(type: events.EventType, callback: events.EventHandler) {
    this.eventHandlers.register(type, callback);
  }

  public emit(type: events.EventType, value: any) {
    this.eventHandlers.handle(
      new events.Event(type, value, game.time.elapsedMS)
    );
  }
}
