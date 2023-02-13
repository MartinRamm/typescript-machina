export type Handler<EventArguments extends any[] = []> = Record<string, never> & { __brand: 'machina-ts-handler' };
export type GetHandlerArguments<E extends Handler> = E extends Handler<infer Args> ? Args : never;

export const handler = <EventArguments extends any[] = []>() => ({} as Handler<EventArguments>);
