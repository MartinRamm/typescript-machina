import type { State } from './state';
import type { Handler } from './handler';
import type { HandlerFn } from './HandlerFn';
import type { MachinaThis, MachinaThisInitializeFn } from './MachinaThis';
import type { SpecialEventNames } from './SpecialEventNames';
import type { DefineState } from './defineState';
import { Event } from './event';
import machina from 'machina';
import { InstantiatableMachina } from './typeRoot/machina/InstantiatableMachina';

type GenericUserFunction<F extends FsmBuilder = any, Args extends any[] = any, ReturnType = any> = (
  this: MachinaThis<F> | MachinaThisInitializeFn<F>,
  ...args: Args
) => ReturnType;

export type FsmBuilder<
  States extends { [key: string]: State } = any,
  Handlers extends { [key: string]: Handler } = any,
  DefaultHandlers extends { [key: string]: HandlerFn } = any,
  Events extends { [key: string]: Event } = any,
  ConstructorArguments extends any[] = any,
  IsInitializeFnAdded extends boolean = any,
  UserDefinedFunctions extends { [key: string]: GenericUserFunction } = any
> = {
  readonly states: States;
  readonly initialState: keyof States;
  readonly handlers: Handlers;
  readonly defaultHandlers: DefaultHandlers;
  readonly events: Events;
  readonly userDefinedFunctions: UserDefinedFunctions;
  readonly initializeFn: IsInitializeFnAdded extends false
    ? undefined
    : (
        this: MachinaThisInitializeFn<
          FsmBuilder<
            States,
            Handlers,
            DefaultHandlers,
            Events,
            ConstructorArguments,
            IsInitializeFnAdded,
            UserDefinedFunctions
          >
        >,
        ...args: ConstructorArguments
      ) => any;
  readonly namespace?: string;
  readonly addDefaultHandler: <EventName extends Exclude<SpecialEventNames | keyof Handlers, keyof DefaultHandlers>>(
    eventName: EventName,
    fn: HandlerFn<
      FsmBuilder<
        States,
        Handlers,
        DefaultHandlers,
        Events,
        ConstructorArguments,
        IsInitializeFnAdded,
        UserDefinedFunctions
      >,
      EventName
    >
  ) => FsmBuilder<
    States,
    Handlers,
    DefaultHandlers & Record<EventName, typeof fn>,
    Events,
    ConstructorArguments,
    IsInitializeFnAdded,
    UserDefinedFunctions
  >;
  readonly addInitializeFn: IsInitializeFnAdded extends true
    ? never
    : <NewConstructorArguments extends any[]>(
        fn: (
          this: MachinaThisInitializeFn<
            FsmBuilder<States, Handlers, DefaultHandlers, Events, NewConstructorArguments, true, UserDefinedFunctions>
          >,
          ...args: NewConstructorArguments
        ) => any
      ) => FsmBuilder<States, Handlers, DefaultHandlers, Events, NewConstructorArguments, true, UserDefinedFunctions>;
  readonly addUserDefinedFn: <
    FnName extends string,
    Fn extends FnName extends keyof UserDefinedFunctions
      ? 'Function with given name already defined'
      : FnName extends keyof MachinaThis<FsmBuilder> | 'deferUntilTransition' | 'deferAndTransition'
      ? 'Function name is a used by machina'
      : GenericUserFunction<
          FsmBuilder<
            States,
            Handlers,
            DefaultHandlers,
            Events,
            ConstructorArguments,
            IsInitializeFnAdded,
            UserDefinedFunctions
          >
        >
  >(
    name: FnName,
    fn: Fn
  ) => FsmBuilder<
    States,
    Handlers,
    DefaultHandlers,
    Events,
    ConstructorArguments,
    IsInitializeFnAdded,
    UserDefinedFunctions & Record<FnName, typeof fn>
  >;
  readonly build: (states: {
    [state in keyof States]: DefineState<
      FsmBuilder<
        States,
        Handlers,
        DefaultHandlers,
        Events,
        ConstructorArguments,
        IsInitializeFnAdded,
        UserDefinedFunctions
      >,
      state
    >;
  }) => InstantiatableMachina<
    FsmBuilder<
      States,
      Handlers,
      DefaultHandlers,
      Events,
      ConstructorArguments,
      IsInitializeFnAdded,
      UserDefinedFunctions
    >
  >;
};

export const builder = <
  States extends { [key: string]: State },
  Handlers extends { [key: string]: Handler },
  Events extends { [key: string]: Event } = Record<string, never>
>(param: {
  states: States;
  initialState: keyof States;
  handlers: Handlers;
  events?: Events;
  namespace?: string;
}): FsmBuilder<States, Handlers, Record<string, never>, Events, [], false, Record<string, never>> => ({
  ...param,
  events: (param.events || {}) as Events,
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
    } as FsmBuilder;
  },
  addInitializeFn(initializeFn) {
    return {
      ...this,
      initializeFn,
    } as FsmBuilder;
  },
  addUserDefinedFn(name, fn) {
    return {
      ...this,
      userDefinedFunctions: {
        ...this.userDefinedFunctions,
        [name]: fn,
      },
    } as FsmBuilder;
  },
  build(states) {
    const statesWithDefaultHandler = {
      ...states,
    };
    Object.keys(statesWithDefaultHandler).forEach((key: keyof typeof statesWithDefaultHandler) => {
      //eslint-disable-next-line security/detect-object-injection
      statesWithDefaultHandler[key] = Object.assign({}, this.defaultHandlers, states[key]);
    });

    //eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return machina.Fsm.extend<typeof this>({
      ...(this.initializeFn === undefined ? {} : { initialize: this.initializeFn }),
      ...('namespace' in this ? { namespace: this.namespace } : {}),
      states: statesWithDefaultHandler,
      initialState: this.initialState,
      ...this.userDefinedFunctions,
    });
  },
});
