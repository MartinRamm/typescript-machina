import {Fsm} from "./fsm";
import {SpecialEventNames} from "./SpecialEventNames";
import {EventFn} from "./EventFn";
import {GetEventArguments} from "./event";

export type MachinaThisInitializeFn<F extends Fsm> = {
    readonly initialize: F extends Fsm<any, any, any, infer ConstructorArguments, infer IsInitializeFnAdded>
        ? IsInitializeFnAdded extends true
            ? (this: MachinaThisInitializeFn<F>, ...args: ConstructorArguments) => any
            : never
        : never,
    //TODO add functions of fsm object (handle, on, etc...)
    //TODO add user defined functions of fsm object
    readonly states: {
        [state in keyof F["states"]]: {
            [event in keyof F["defaultHandlers"]]: EventFn<F, event>
        } & {
            [event in Exclude<SpecialEventNames | keyof F["events"], keyof F["defaultHandlers"]>]?: EventFn<F, event>
        }
    },
    readonly initialState: keyof F["states"],
    readonly eventListeners: Record<string, Array<(...args: any[]) => any>>,
    readonly namespace: string,
    readonly useSafeEmit: boolean,
    readonly hierarchy: object,
    readonly pendingDelegations: object,

    transition<StateName extends keyof F["states"]>(stateName: StateName, ...args: GetStateArguments<F["states"][StateName]>): void;
}

export type CurrentActionArgs<F extends Fsm, EventName extends keyof F["events"] = keyof F["events"]> =
    [
        { inputType: EventName, delegated: boolean, ticket: any },
        ...GetEventArguments<F["events"][EventName]>
    ];

export type MachinaThis<F extends Fsm> = MachinaThisInitializeFn<F> & {
    readonly inputQueue: any[],
    readonly targetReplayState: keyof F["states"],
    readonly state: keyof F["states"],
    readonly priorState: '' | keyof F["states"],
    readonly currentAction: '' | `${keyof F["states"] extends string | number ? keyof F["states"] : never}.${keyof F["events"] extends string | number ? keyof F["events"] : never}`,
    readonly currentActionArgs: undefined | CurrentActionArgs<F>,
    readonly inExitHandler: boolean,

} & F["userDefinedFunctions"]