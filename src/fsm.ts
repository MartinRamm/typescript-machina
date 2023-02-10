import type {State} from "./state";
import type {Event} from "./event";
import type {EventFn} from "./EventFn";
import type {MachinaThisInitializeFn} from "./MachinaThis";
import type {SpecialEventNames} from "./SpecialEventNames";

export type Fsm<
    States extends {[key: string]: State} = any,
    Events extends {[key: string]: Event} = any,
    DefaultHandlers extends {[key: string]: EventFn} = any,
    ConstructorArguments extends any[] = any,
    IsInitializeFnAdded extends boolean = any,
> = {
    readonly states: States,
    readonly events: Events,
    readonly defaultHandlers: DefaultHandlers,
    readonly initializeFn: undefined | ((this: MachinaThisInitializeFn<Fsm<States, Events, DefaultHandlers, ConstructorArguments, IsInitializeFnAdded>>, ...args: ConstructorArguments) => any),
    addDefaultHandler:
        <EventName extends Exclude<SpecialEventNames | keyof Events, keyof DefaultHandlers>>
        (eventName: EventName, fn: EventFn<Fsm<States, Events, DefaultHandlers, ConstructorArguments, IsInitializeFnAdded>, EventName>)
            => Fsm<States, Events, DefaultHandlers & Record<EventName, typeof fn>, ConstructorArguments, IsInitializeFnAdded>,
    addInitializeFn: IsInitializeFnAdded extends true ? never :
        <NewConstructorArguments extends any[]>
        (fn: (this: MachinaThisInitializeFn<Fsm<States, Events, DefaultHandlers, ConstructorArguments, IsInitializeFnAdded>>, ...args: NewConstructorArguments) => any)
            => Fsm<States, Events, DefaultHandlers, NewConstructorArguments, true>,
};

export const fsm = <
    States extends {[key: string]: State},
    Events extends {[key: string]: Event}
>(param: {states: States, events: Events}): Fsm<States, Events, {}, [], false> => ({
    ...param,
    defaultHandlers: {},
    initializeFn: undefined,
    addDefaultHandler(eventName, eventFn) {
        return {
            ...this,
            defaultHandlers: {
                ...this.defaultHandlers,
                [eventName]: eventFn,
            },
        } as Fsm;
    },
    addInitializeFn(initializeFn) {
        return {
            ...this,
            initializeFn,
        } as Fsm;
    },
});