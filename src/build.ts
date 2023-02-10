import type {Fsm} from "./fsm";
import type {DefineState} from "./defineState";

export type Build<F extends Fsm, ConstructorArguments extends any[] = []> = {
    [state in F["states"]]: DefineState<F, state>
}