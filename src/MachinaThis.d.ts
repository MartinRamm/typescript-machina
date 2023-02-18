import { FsmBuilder } from './builder';
import { SpecialHandlerNames } from './SpecialHandlerNames';
import { HandlerFn } from './handlerFn';
import { GetHandlerArguments } from './handler';
import { GetEventArguments } from './event';
import { InternallyEmittedEvents } from './InternallyEmittedEvents';

type EventHandlerFn<
  F extends FsmBuilder,
  EventName extends '*' | keyof InternallyEmittedEvents<F> | keyof F['events']
> = EventName extends keyof InternallyEmittedEvents<F>
  ? (
      this: MachinaThisInitializeFn<F> | MachinaThis<F>,
      ...args: GetHandlerArguments<InternallyEmittedEvents<F>[EventName]>
    ) => any
  : EventName extends keyof F['events']
  ? (this: MachinaThisInitializeFn<F> | MachinaThis<F>, ...args: GetEventArguments<F['events'][EventName]>) => any
  : (
      this: MachinaThisInitializeFn<F> | MachinaThis<F>,
      eventName: keyof InternallyEmittedEvents<F> | keyof F['events'],
      ...data:
        | GetEventArguments<InternallyEmittedEvents<F>[keyof InternallyEmittedEvents<F>]>
        | GetEventArguments<F['events'][keyof F['events']]>
    ) => any;

export type MachinaThisInitializeFn<F extends FsmBuilder> = {
  readonly initialize: F extends FsmBuilder<any, any, any, any, infer ConstructorArguments, infer IsInitializeFnAdded>
    ? IsInitializeFnAdded extends true
      ? (this: MachinaThisInitializeFn<F>, ...args: ConstructorArguments) => any
      : never
    : never;
  readonly states: {
    [state in keyof F['states']]: {
      [event in keyof F['defaultHandlers']]: HandlerFn<F, event>;
    } & {
      [event in Exclude<SpecialHandlerNames | keyof F['handlers'], keyof F['defaultHandlers']>]?: HandlerFn<F, event>;
    };
  };
  readonly initialState: F['initialState'];
  readonly eventListeners: Record<string, Array<(...args: any[]) => any>>;
  readonly namespace: string;
  readonly useSafeEmit: boolean;
  readonly hierarchy: object;
  readonly pendingDelegations: object;

  transition<StateName extends keyof F['states']>(
    stateName: StateName,
    ...args: GetStateArguments<F['states'][StateName]>
  ): void;
  handle<EventName extends keyof F['handlers']>(
    eventName: EventName,
    ...args: GetHandlerArguments<F['handlers'][EventName]>
  ): void;
  emit<EventName extends keyof F['events']>(
    eventName: EventName,
    ...args: GetEventArguments<F['events'][EventName]>
  ): void;
  on<EventName extends '*' | keyof InternallyEmittedEvents<F> | keyof F['events']>(
    eventName: EventName,
    fn: EventHandlerFn<F, EventName>
  ): void;
  off<EventName extends '*' | keyof InternallyEmittedEvents<F> | keyof F['events']>(
    eventName: EventName,
    fn: EventHandlerFn<F, EventName>
  ): void;
} & {
  //we need to remove the "this" parameter in the user defined functions, to avoid error TS2684.
  // Hence `& F['userDefinedFunctions']` doesn't work
  [userDefinedFn in keyof F['userDefinedFunctions']]: F['userDefinedFunctions'][userDefinedFn] extends (
    ...args: infer Args
  ) => infer ReturnType
    ? (...args: Args) => ReturnType
    : never;
};

export type CurrentActionArgs<F extends FsmBuilder, EventName extends keyof F['handlers'] = keyof F['handlers']> = [
  { inputType: EventName; delegated: boolean; ticket: any },
  ...GetHandlerArguments<F['handlers'][EventName]>
];

export type CurrentAction<F extends FsmBuilder> =
  | ''
  | `${keyof F['states'] extends string | number ? keyof F['states'] : never}.${keyof F['handlers'] extends
      | string
      | number
      ? keyof F['handlers']
      : never}`;

export type MachinaThis<F extends FsmBuilder> = MachinaThisInitializeFn<F> & {
  readonly inputQueue: any[];
  readonly targetReplayState: keyof F['states'];
  readonly state: keyof F['states'];
  readonly priorState: '' | keyof F['states'];
  readonly currentAction: CurrentAction<F>;
  readonly currentActionArgs: undefined | CurrentActionArgs<F>;
  readonly inExitHandler: boolean;
};
