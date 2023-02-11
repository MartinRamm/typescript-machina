export type Event<EventArguments extends any[] = []> = Record<string, never> & { __brand: 'machina-ts-event' };
export type GetEventArguments<E extends Event> = E extends Event<infer Args> ? Args : never;

export const event = <EventArguments extends any[] = []>() => ({} as Event<EventArguments>);
