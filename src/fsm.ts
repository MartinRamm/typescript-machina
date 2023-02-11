import type {State} from "./state";
import type {Event} from "./event";
import type {EventFn} from "./EventFn";
import type {MachinaThis, MachinaThisInitializeFn} from "./MachinaThis";
import type {SpecialEventNames} from "./SpecialEventNames";
import type {DefineState} from "./defineState";
import machina from "machina";
import type {InstantiableFsm} from "machina";

type GenericUserFunction<F extends Fsm = any, Args extends any[] = any, ReturnType extends any = any> =
    (this: MachinaThis<F> | MachinaThisInitializeFn<F>, ...args: Args) => ReturnType;

export type Fsm<
    States extends {[key: string]: State} = any,
    Events extends {[key: string]: Event} = any,
    DefaultHandlers extends {[key: string]: EventFn} = any,
    EmittableEvents extends {[key: string]: Event} = any,
    ConstructorArguments extends any[] = any,
    IsInitializeFnAdded extends boolean = any,
    UserDefinedFunctions extends {[key: string]: GenericUserFunction} = any,
> = {
    readonly states: States,
    readonly initialState: keyof States,
    readonly events: Events,
    readonly emittableEvents: EmittableEvents,
    readonly defaultHandlers: DefaultHandlers,
    readonly userDefinedFunctions: UserDefinedFunctions,
    readonly initializeFn: IsInitializeFnAdded extends false ? undefined : ((this: MachinaThisInitializeFn<Fsm<States, Events, DefaultHandlers, EmittableEvents, ConstructorArguments, IsInitializeFnAdded, UserDefinedFunctions>>, ...args: ConstructorArguments) => any),
    readonly namespace?: string,
    readonly addDefaultHandler:
        <EventName extends Exclude<SpecialEventNames | keyof Events, keyof DefaultHandlers>>
        (eventName: EventName, fn: EventFn<Fsm<States, Events, DefaultHandlers, EmittableEvents, ConstructorArguments, IsInitializeFnAdded, UserDefinedFunctions>, EventName>)
            => Fsm<States, Events, DefaultHandlers & Record<EventName, typeof fn>, EmittableEvents, ConstructorArguments, IsInitializeFnAdded, UserDefinedFunctions>,
    readonly addInitializeFn: IsInitializeFnAdded extends true ? never :
        <NewConstructorArguments extends any[]>
        (fn: (this: MachinaThisInitializeFn<Fsm<States, Events, DefaultHandlers, EmittableEvents, NewConstructorArguments, true, UserDefinedFunctions>>, ...args: NewConstructorArguments) => any)
            => Fsm<States, Events, DefaultHandlers, EmittableEvents, NewConstructorArguments, true, UserDefinedFunctions>,
    readonly addUserDefinedFn:
        <FnName extends string,
            Fn extends FnName extends keyof UserDefinedFunctions
                ? 'Function with given name already defined'
                : FnName extends keyof MachinaThis<Fsm> | 'deferUntilTransition' | 'deferAndTransition'
                    ? 'Function name is a used by machina'
                    : GenericUserFunction<Fsm<States, Events, DefaultHandlers, EmittableEvents, ConstructorArguments, IsInitializeFnAdded, UserDefinedFunctions>>>
        (name: FnName, fn: Fn)
            => Fsm<States, Events, DefaultHandlers, EmittableEvents, ConstructorArguments, IsInitializeFnAdded, UserDefinedFunctions & Record<FnName, typeof fn>>,
    readonly build: (states: {
        [state in keyof States]: DefineState<Fsm<States, Events, DefaultHandlers, EmittableEvents, ConstructorArguments, IsInitializeFnAdded, UserDefinedFunctions>, state>
    }) => InstantiableFsm<Fsm<States, Events, DefaultHandlers, EmittableEvents, ConstructorArguments, IsInitializeFnAdded, UserDefinedFunctions>>,
};

export const fsm = <
    States extends {[key: string]: State},
    Events extends {[key: string]: Event},
    EmittableEvents extends {[key: string]: Event} = {},
>(param: {
    states: States,
    initialState: keyof States,
    events: Events,
    emittableEvents: EmittableEvents,
    namespace?: string,
}): Fsm<States, Events, {}, EmittableEvents, [], false, {}> => ({
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
    build(states) {
        const statesWithDefaultHandler = {
            ...states
        };
        Object.keys(statesWithDefaultHandler).forEach((key: keyof typeof statesWithDefaultHandler) => {
            statesWithDefaultHandler[key] = Object.assign({}, this.defaultHandlers, states[key]);
        })

        return machina.Fsm.extend({
            ...(this.initializeFn === undefined ? {} : {initialize: this.initializeFn}),
            ...('namespace' in this ? {namespace: this.namespace} : {}),
            states: statesWithDefaultHandler,
            initialState: this.initialState,
            ...this.userDefinedFunctions,
        });
    },
});
