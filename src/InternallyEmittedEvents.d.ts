import { Fsm } from './fsm';
import type { CurrentAction, CurrentActionArgs } from './MachinaThis';
import type { Event } from './event';

export type InternallyEmittedEvents<F extends Fsm> = {
  transition: Event<
    [
      {
        fromState: undefined | keyof F['states'];
        toState: keyof F['states'];
        action: CurrentAction<F>;
        namespace: string;
      }
    ]
  >;
  transitioned: InternallyEmittedEvents<F>['transition'];
  handling: Event<
    [
      {
        inputType: keyof F['events'];
        delegated: boolean;
        ticket: unknown;
        namespace: string;
      }
    ]
  >;
  handled: InternallyEmittedEvents<F>['handling'];
  nohandler: Event<
    [
      {
        inputType: string;
        delegated: boolean;
        ticket: unknown;
        namespace: string;
      }
    ]
  >;
  invalidstate: Event<
    [
      {
        state: keyof F['states'];
        attemptedState: string;
        namespace: string;
      }
    ]
  >;
  deferred: Event<
    [
      {
        state: keyof F['states'];
        queuedArgs: {
          type: 'transition';
          untilState: [keyof F['states']];
          args: CurrentActionArgs<F>;
        };
        namespace: string;
      }
    ]
  >;
};
