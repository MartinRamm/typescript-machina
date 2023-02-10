import type {State} from "./state";
import type {Event} from "./event";
import type {EventFn} from "./EventFn";
import type {MachinaThis, MachinaThisInitializeFn} from "./MachinaThis";
import type {SpecialEventNames} from "./SpecialEventNames";

type GenericUserFunction<F extends Fsm = any, Args extends any[] = any, ReturnType extends any = any> = (this: MachinaThis<F> | MachinaThisInitializeFn<F>, ...args: Args) => ReturnType;

export type Fsm<
    States extends {[key: string]: State} = any,
    Events extends {[key: string]: Event} = any,
    DefaultHandlers extends {[key: string]: EventFn} = any,
    ConstructorArguments extends any[] = any,
    IsInitializeFnAdded extends boolean = any,
    UserDefinedFunctions extends {[key: string]: GenericUserFunction} = any,
> = {
    readonly states: States,
    readonly events: Events,
    readonly defaultHandlers: DefaultHandlers,
    readonly userDefinedFunctions: UserDefinedFunctions,
    readonly initializeFn: IsInitializeFnAdded extends false ?  undefined : ((this: MachinaThisInitializeFn<Fsm<States, Events, DefaultHandlers, ConstructorArguments, IsInitializeFnAdded, UserDefinedFunctions>>, ...args: ConstructorArguments) => any),
    addDefaultHandler:
        <EventName extends Exclude<SpecialEventNames | keyof Events, keyof DefaultHandlers>>
        (eventName: EventName, fn: EventFn<Fsm<States, Events, DefaultHandlers, ConstructorArguments, IsInitializeFnAdded, UserDefinedFunctions>, EventName>)
            => Fsm<States, Events, DefaultHandlers & Record<EventName, typeof fn>, ConstructorArguments, IsInitializeFnAdded, UserDefinedFunctions>,
    addInitializeFn: IsInitializeFnAdded extends true ? never :
        <NewConstructorArguments extends any[]>
        (fn: (this: MachinaThisInitializeFn<Fsm<States, Events, DefaultHandlers, NewConstructorArguments, true, UserDefinedFunctions>>, ...args: NewConstructorArguments) => any)
            => Fsm<States, Events, DefaultHandlers, NewConstructorArguments, true, UserDefinedFunctions>,
    addUserDefinedFn:
        <FnName extends string,
        Fn extends
            FnName extends keyof UserDefinedFunctions
                ? 'Function with given name already defined'
                : FnName extends keyof MachinaThis<Fsm> | 'deferUntilTransition' | 'deferAndTransition'
                    ? 'Function name is a used by machina'
                    : GenericUserFunction<Fsm<States, Events, DefaultHandlers, ConstructorArguments, IsInitializeFnAdded, UserDefinedFunctions>>>
        (name: FnName, fn: Fn)
            => Fsm<States, Events, DefaultHandlers, ConstructorArguments, IsInitializeFnAdded, UserDefinedFunctions & Record<FnName, typeof fn>>,
};

export const fsm = <
    States extends {[key: string]: State},
    Events extends {[key: string]: Event}
>(param: {states: States, events: Events}): Fsm<States, Events, {}, [], false, {}> => ({
    ...param,
    defaultHandlers: {},
    initializeFn: undefined,
    userDefinedFunctions: {},
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
    addUserDefinedFn(name, fn) {
        return {
            ...this,
            userDefinedFunctions: {
                ...this.userDefinedFunctions,
                [name]: fn,
            },
        } as Fsm;
    },
});

