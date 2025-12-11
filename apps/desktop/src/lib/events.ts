// Type definitions for Backend Events
// Must match domain/events.rs

export type AppEvent = 
  | { event: 'config:changed'; payload: { key: string; value: string } }
  // | { event: 'download:progress'; payload: { id: string; progress: number } }
;

export type EventName = AppEvent['event'];

export type EventPayload<T extends EventName> = Extract<AppEvent, { event: T }>['payload'];
