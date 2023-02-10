import {Fsm} from "./fsm";
import {GetStateArguments} from "./state";
import {MachinaThisEventFn} from "./MachinaThisInitializeFn";

export type SpecialEventNames = '*' | '_onEnter' | '_onExit';
export type GetSpecialEventArguments<F extends Fsm, EventName extends SpecialEventNames, StateName extends keyof F["states"]>
    = EventName extends '*'
    ? any[]
    : EventName extends '_onEnter'
        ? keyof F["states"] extends StateName ? never : GetStateArguments<F[StateName]>
        : [MachinaThisEventFn<F, '_onExit'>];