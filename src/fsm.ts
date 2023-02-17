import {State} from "./state";
import {Handler} from "./handler";
import {Event} from "./event";

export { builder } from './builder';
export { state } from './state';
export const anyState = <TransitionArguments extends any[] = any[]>() => ({} as Record<string, State<TransitionArguments>>);
export { event } from './event';
export const anyEvent = <EventArguments extends any[] = any[]>() => ({} as Record<string, Event<EventArguments>>);
export { handler } from './handler';
export { handlerFn } from './handlerFn';
export const anyHandler = <HandlerArguments extends any[] = any[]>() => ({} as Record<string, Handler<HandlerArguments>>);
export { defineState } from './defineState';
