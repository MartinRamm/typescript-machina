import type { FsmBuilder } from './builder';
import type { SpecialEventNames } from './SpecialEventNames';
import type { HandlerFn } from './HandlerFn';
import type { GetStateArguments } from './state';

type DefineStateInput<F extends FsmBuilder, StateName extends keyof F['states']> = {
  [eventName in SpecialEventNames | keyof F['handlers']]?: HandlerFn<F, eventName, StateName>;
} & [] extends GetStateArguments<F['states'][StateName]>
  ? Record<string, never>
  : { _onEnter: HandlerFn<F, '_onEnter', StateName> };

export type DefineState<F extends FsmBuilder, StateName extends keyof F['states']> = DefineStateInput<F, StateName> & {
  __brand: 'machina-ts-define-state';
};

export const defineState = <F extends FsmBuilder, StateName extends keyof F['states']>(
  handlers: DefineStateInput<F, StateName>
) => handlers as DefineState<F, StateName>;
