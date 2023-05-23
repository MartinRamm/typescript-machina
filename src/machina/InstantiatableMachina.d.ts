import type { FsmBuilder as TypescriptFsm } from '../builder';
import type { MachinaThis } from '../MachinaThis';

export type InstantiatableMachina<F extends TypescriptFsm> = {
  new (
    ...args: F extends TypescriptFsm<any, any, any, any, infer ConstructorArguments> ? ConstructorArguments : never
  ): MachinaThis<F>;
};
