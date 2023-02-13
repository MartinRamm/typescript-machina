export type EmittableEvent<EventArguments extends any[] = []> = Record<string, never> & { __brand: 'machina-ts-emittable-event' };
export type GetEmittableEventArguments<E extends EmittableEvent> = E extends EmittableEvent<infer Args> ? Args : never;

export const emittableEvent = <EventArguments extends any[] = []>() => ({} as EmittableEvent<EventArguments>);
