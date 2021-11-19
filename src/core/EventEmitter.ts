import { IBaseEvent } from "./IBaseEvent";

export type Listener<TPayload> = (payload: TPayload) => void;
export type EventId = string | number | symbol;
export type Events<T = any> = Map<EventId, Listener<T>[]>;

export class EventEmitter {
  private readonly events: Events = new Map();

  public on<TEvent extends IBaseEvent<any, any>>(
    event: TEvent['type'],
    listener: Listener<TEvent['payload']>
  ): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event)!.push(listener);

    return () => this.unsubscribe(event, listener);
  }

  public unsubscribe(event: EventId, listener: Listener<any>): void {
    const listeners = this.events.get(event);

    if (!listeners) {
      return;
    }

    const idx: number = listeners.indexOf(listener);

    if (idx > -1) {
      listeners.splice(idx, 1);
    }
  }

  public reset(): void {
    Array.from(this.events.keys()).forEach((event: EventId) => {
      const listeners = this.events.get(event)!;
      listeners.splice(0, listeners.length);
    });
  }

  public emit<TEvent extends IBaseEvent<any, any>>(event: TEvent['type'], payload: TEvent['payload']): void {
    const listeners = this.events.get(event);

    if (!listeners) {
      return;
    }

    listeners.forEach(listener => listener.call(this, payload));
  }

  public once<TEvent extends IBaseEvent<any, any>>(event: TEvent['type'], listener: Listener<TEvent['payload']>): void {
    const unsubscribe: () => void = this.on<TEvent>(event, payload => {
      unsubscribe();
      listener.call(this, payload);
    });
  }

  public hasListeners(event: EventId): boolean {
    return this.events.has(event) && this.events.get(event)!.length > 0;
  }
}
