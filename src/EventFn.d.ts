import { Fsm } from './fsm';
import { GetEventArguments } from './event';
import { GetSpecialEventArguments, SpecialEventNames } from './SpecialEventNames';
import { GetStateArguments } from './state';
import { CurrentActionArgs, MachinaThis } from './MachinaThis';

type MachinaThisEventFn<F extends Fsm, EventName extends SpecialEventNames | keyof F['events']> = MachinaThis<F> & {
  readonly currentActionArgs: EventName extends SpecialEventNames
    ? CurrentActionArgs<F>
    : EventName extends keyof F['events']
    ? CurrentActionArgs<F, EventName>
    : never;
  readonly inExitHandler: EventName extends '_onExit' ? true : false;

  deferUntilTransition(stateName: keyof F['states']): void;
  //as tested in v4.0.2, deferAndTransition only forwards the second arg to _onEnter (unlike "transition", which
  //forwards all args except the first one). So this fn can only accept states that require no or only one argument.
  deferAndTransition<
    StateName extends keyof {
      [key in keyof F['states'] as GetStateArguments<F['states'][key]> extends [] | [any] ? key : never]: any;
    }
  >(
    stateName: StateName,
    ...args: GetStateArguments<F['states'][StateName]>
  ): void;
};

export type EventFn<
  F extends Fsm = Fsm,
  EventName extends SpecialEventNames | keyof F['events'] = SpecialEventNames | keyof F['events'],
  StateName extends keyof F['states'] = keyof F['states']
> =
  | keyof { [key in keyof F['states'] as [] extends GetStateArguments<F['states'][key]> ? key : never]: any }
  | ((
      this: MachinaThisEventFn<F, EventName>,
      ...args: EventName extends SpecialEventNames
        ? GetSpecialEventArguments<F, EventName, StateName>
        : EventName extends keyof F['events']
        ? GetEventArguments<F['events'][EventName]>
        : never
    ) => any);
