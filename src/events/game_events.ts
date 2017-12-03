import * as events from '../events';
import { game } from '../index';

export class GameEvents {
  private eventQueue: events.EventQueue;
  private eventHandlers: events.EventHandlers;

  // Global event handlers that can't be unregistered.
  private globalHandlers: events.EventHandlers;

  constructor(globalHandlers: events.EventHandlers) {
    this.eventQueue = new events.EventQueue(0);
    this.eventHandlers = new events.EventHandlers();
    this.globalHandlers = globalHandlers;
  }

  public schedule(type: events.EventType, value: any, delay: number) {
    this.eventQueue.add(type, value, delay);
  }

  public tick(elapsed: number) {
    const ended = this.eventQueue.tick(elapsed);
    ended.forEach((event: events.Event) => {
      this.internalEmit(event);
    });
  }

  public addListener(type: events.EventType, callback: events.EventHandler) {
    this.eventHandlers.register(type, callback);
  }

  public emit(type: events.EventType, value: any) {
    this.internalEmit(new events.Event(type, value, game.time.elapsedMS));
  }

  private internalEmit(e: events.Event) {
    this.eventHandlers.handle(e);
    this.globalHandlers.handle(e);
  }
}
