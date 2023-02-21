import type { FsmBuilder } from './builder';
import type { SpecialHandlerNames } from './SpecialHandlerNames';
import type { GetStateArguments } from './state';
import type { HandlerFn } from './handlerFn';

type DefineStateInput<F extends FsmBuilder, StateName extends keyof F['states']> = {
  [handlerName in Exclude<SpecialHandlerNames, '_onEnter'> | keyof F['handlers']]?: HandlerFn<
    F,
    handlerName,
    StateName
  >;
} & ([] extends GetStateArguments<F['states'][StateName]>
  ? { _onEnter?: HandlerFn<F, '_onEnter', StateName> }
  : { _onEnter: HandlerFn<F, '_onEnter', StateName> });

export type DefineState<F extends FsmBuilder, StateName extends keyof F['states']> = DefineStateInput<F, StateName> & {
  __brand: 'machina-ts-define-state';
};

export const defineState = <F extends FsmBuilder, StateName extends keyof F['states']>(
  handlers: DefineStateInput<F, StateName>
) => handlers as DefineState<F, StateName>;
