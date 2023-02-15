import { FsmBuilder } from './builder';
import { GetStateArguments } from './state';
import { MachinaThisEventFn } from './MachinaThisInitializeFn';
import { GetHandlerArguments } from './handler';

export type SpecialHandlerNames = '*' | '_onEnter' | '_onExit';
export type GetSpecialHandlerArguments<
  F extends FsmBuilder,
  HandlerName extends SpecialHandlerNames,
  StateName extends keyof F['states']
> = HandlerName extends '*'
  ? GetHandlerArguments<F['handlers'][keyof F['handlers']]>
  : HandlerName extends '_onEnter'
  ? keyof F['states'] extends StateName
    ? never
    : GetStateArguments<F[StateName]>
  : [MachinaThisEventFn<F, '_onExit'>];
