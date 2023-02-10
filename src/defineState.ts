import type {Fsm} from "./fsm";
import type {SpecialEventNames} from "./SpecialEventNames";
import type {EventFn} from "./EventFn";

export type DefineState<F extends Fsm, StateName extends keyof F["states"]> = {
    [eventName in SpecialEventNames | keyof F["events"]]?: EventFn<F, eventName, StateName>
};

export const defineState = <F extends Fsm, StateName extends keyof F["states"]>(handlers: DefineState<F, StateName>) => handlers