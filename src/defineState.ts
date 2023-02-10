import type {Fsm} from "./fsm";
import type {SpecialEventNames} from "./SpecialEventNames";
import type {EventFn} from "./EventFn";
import type {GetStateArguments} from "./state";

export type DefineState<F extends Fsm, StateName extends keyof F["states"]> = {
    [eventName in SpecialEventNames | keyof F["events"]]?: EventFn<F, eventName, StateName>
} &
    [] extends GetStateArguments<F["states"][StateName]>
        ? {}
        : {_onEnter: EventFn<F, '_onEnter', StateName>};

export const defineState = <F extends Fsm, StateName extends keyof F["states"]>(handlers: DefineState<F, StateName>) => handlers