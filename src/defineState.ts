import type { Fsm } from './fsm';
import type { SpecialEventNames } from './SpecialEventNames';
import type { EventFn } from './EventFn';
import type { GetStateArguments } from './state';

type DefineStateInput<F extends Fsm, StateName extends keyof F['states']> = {
  [eventName in SpecialEventNames | keyof F['events']]?: EventFn<F, eventName, StateName>;
} & [] extends GetStateArguments<F['states'][StateName]>
  ? Record<string, never>
  : { _onEnter: EventFn<F, '_onEnter', StateName> };

export type DefineState<F extends Fsm, StateName extends keyof F['states']> = DefineStateInput<F, StateName> & {
  __brand: 'machina-ts-define-state';
};

export const defineState = <F extends Fsm, StateName extends keyof F['states']>(
  handlers: DefineStateInput<F, StateName>
) => handlers as DefineState<F, StateName>;
