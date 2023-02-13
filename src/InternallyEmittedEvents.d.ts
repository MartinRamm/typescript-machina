import { Fsm } from './fsm';
import type { CurrentAction, CurrentActionArgs } from './MachinaThis';
import {EmittableEvent} from "./emittableEvent";

export type InternallyEmittedEvents<F extends Fsm> = {
  transition: EmittableEvent<
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
  handling: EmittableEvent<
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
  nohandler: EmittableEvent<
    [
      {
        inputType: string;
        delegated: boolean;
        ticket: unknown;
        namespace: string;
      }
    ]
  >;
  invalidstate: EmittableEvent<
    [
      {
        state: keyof F['states'];
        attemptedState: string;
        namespace: string;
      }
    ]
  >;
  deferred: EmittableEvent<
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
