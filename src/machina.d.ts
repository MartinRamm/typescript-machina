declare module 'machina' {
    import type {Fsm as TypescriptFsm} from "./fsm";
    import type {MachinaThis} from "./MachinaThis";

    export interface InstantiableFsm<F extends TypescriptFsm> {
        new(...args: F extends TypescriptFsm<any, any, any, any, infer ConstructorArguments>
            ? ConstructorArguments
            : never
        ) : MachinaThis<F>;
    }

    interface Fsm<F extends TypescriptFsm> {
        extend(params: object): InstantiableFsm<F>;
    }

    export default {
        Fsm
    };
}