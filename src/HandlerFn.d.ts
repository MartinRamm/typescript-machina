import { FsmBuilder } from './builder';
import { GetHandlerArguments } from './handler';
import { GetSpecialEventArguments, SpecialEventNames } from './SpecialEventNames';
import { GetStateArguments } from './state';
import { CurrentActionArgs, MachinaThis } from './MachinaThis';

type MachinaThisHandlerFn<
  F extends FsmBuilder,
  EventName extends SpecialEventNames | keyof F['handlers']
> = MachinaThis<F> & {
  readonly currentActionArgs: EventName extends SpecialEventNames
    ? CurrentActionArgs<F>
    : EventName extends keyof F['handlers']
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

export type HandlerFn<
  F extends FsmBuilder = FsmBuilder,
  EventName extends SpecialEventNames | keyof F['handlers'] = SpecialEventNames | keyof F['handlers'],
  StateName extends keyof F['states'] = keyof F['states']
> =
  | keyof { [key in keyof F['states'] as [] extends GetStateArguments<F['states'][key]> ? key : never]: any }
  | ((
      this: MachinaThisHandlerFn<F, EventName>,
      ...args: EventName extends SpecialEventNames
        ? GetSpecialEventArguments<F, EventName, StateName>
        : EventName extends keyof F['handlers']
        ? GetHandlerArguments<F['handlers'][EventName]>
        : never
    ) => any);