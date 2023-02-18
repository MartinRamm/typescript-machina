import type { FsmBuilder } from './builder';
import type { SpecialHandlerNames } from './SpecialHandlerNames';
import type { GetStateArguments } from './state';
import { handlerFn } from './handlerFn';

type DefineStateInput<F extends FsmBuilder, StateName extends keyof F['states']> = {
  [handlerName in SpecialHandlerNames | keyof F['handlers']]?: ReturnType<typeof handlerFn>;
} & ([] extends GetStateArguments<F['states'][StateName]>
  ? { _onEnter?: ReturnType<typeof handlerFn> }
  : { _onEnter: ReturnType<typeof handlerFn> });

export type DefineState<F extends FsmBuilder, StateName extends keyof F['states']> = DefineStateInput<F, StateName> & {
  __brand: 'machina-ts-define-state';
};

export const defineState = <F extends FsmBuilder, StateName extends keyof F['states']>(
  handlers: DefineStateInput<F, StateName>
) => handlers as DefineState<F, StateName>;
