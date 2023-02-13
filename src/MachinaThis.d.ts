import { Fsm } from './fsm';
import { SpecialEventNames } from './SpecialEventNames';
import { EventFn } from './EventFn';
import { GetEventArguments } from './event';
import { GetEmittableEventArguments } from './emittableEvent';
import { InternallyEmittedEvents } from './InternallyEmittedEvents';

type EventHandlerFn<
  F extends Fsm,
  EventName extends '*' | keyof InternallyEmittedEvents<F> | keyof F['emittableEvents']
> = EventName extends keyof InternallyEmittedEvents<F>
  ? (
      this: MachinaThisInitializeFn<F> | MachinaThis<F>,
      ...args: GetEventArguments<InternallyEmittedEvents<F>[EventName]>
    ) => any
  : EventName extends keyof F['emittableEvents']
  ? (
      this: MachinaThisInitializeFn<F> | MachinaThis<F>,
      ...args: GetEmittableEventArguments<F['emittableEvents'][EventName]>
    ) => any
  : (
      this: MachinaThisInitializeFn<F> | MachinaThis<F>,
      eventName: keyof InternallyEmittedEvents<F> | keyof F['emittableEvents'],
      ...data:
        | GetEmittableEventArguments<InternallyEmittedEvents<F>[keyof InternallyEmittedEvents<F>]>
        | GetEmittableEventArguments<F['emittableEvents'][keyof F['emittableEvents']]>
    ) => any;

export type MachinaThisInitializeFn<F extends Fsm> = {
  readonly initialize: F extends Fsm<any, any, any, any, infer ConstructorArguments, infer IsInitializeFnAdded>
    ? IsInitializeFnAdded extends true
      ? (this: MachinaThisInitializeFn<F>, ...args: ConstructorArguments) => any
      : never
    : never;
  readonly states: {
    [state in keyof F['states']]: {
      [event in keyof F['defaultHandlers']]: EventFn<F, event>;
    } & {
      [event in Exclude<SpecialEventNames | keyof F['events'], keyof F['defaultHandlers']>]?: EventFn<F, event>;
    };
  };
  readonly initialState: keyof F['states'];
  readonly eventListeners: Record<string, Array<(...args: any[]) => any>>;
  readonly namespace: string;
  readonly useSafeEmit: boolean;
  readonly hierarchy: object;
  readonly pendingDelegations: object;

  transition<StateName extends keyof F['states']>(
    stateName: StateName,
    ...args: GetStateArguments<F['states'][StateName]>
  ): void;
  handle<EventName extends keyof F['events']>(
    eventName: EventName,
    ...args: GetEventArguments<F['events'][EventName]>
  ): void;
  emit<EventName extends keyof F['emittableEvents']>(
    eventName: EventName,
    ...args: GetEmittableEventArguments<F['emittableEvents'][EventName]>
  ): void;
  on<EventName extends '*' | keyof InternallyEmittedEvents<F> | keyof F['emittableEvents']>(
    eventName: EventName,
    fn: EventHandlerFn<F, EventName>
  ): void;
  off<EventName extends '*' | keyof InternallyEmittedEvents<F> | keyof F['emittableEvents']>(
    eventName: EventName,
    fn: EventHandlerFn<F, EventName>
  ): void;
} & F['userDefinedFunctions'];

export type CurrentActionArgs<F extends Fsm, EventName extends keyof F['events'] = keyof F['events']> = [
  { inputType: EventName; delegated: boolean; ticket: any },
  ...GetEventArguments<F['events'][EventName]>
];

export type CurrentAction<F extends Fsm> =
  | ''
  | `${keyof F['states'] extends string | number ? keyof F['states'] : never}.${keyof F['events'] extends
      | string
      | number
      ? keyof F['events']
      : never}`;

export type MachinaThis<F extends Fsm> = MachinaThisInitializeFn<F> & {
  readonly inputQueue: any[];
  readonly targetReplayState: keyof F['states'];
  readonly state: keyof F['states'];
  readonly priorState: '' | keyof F['states'];
  readonly currentAction: CurrentAction<F>;
  readonly currentActionArgs: undefined | CurrentActionArgs<F>;
  readonly inExitHandler: boolean;
};
