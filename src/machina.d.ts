declare module 'machina' {
  import type { FsmBuilder as TypescriptFsm } from './builder';
  import type { MachinaThis } from './MachinaThis';

  //eslint-disable-next-line @typescript-eslint/naming-convention
  const Fsm: {
    extend<F extends TypescriptFsm>(
      params: object
    ): {
      new (
        ...args: F extends TypescriptFsm<any, any, any, any, infer ConstructorArguments> ? ConstructorArguments : never
      ): MachinaThis<F>;
    };
  };

  //eslint-disable-next-line import/no-default-export
  export default {
    //eslint-disable-next-line @typescript-eslint/naming-convention
    Fsm,
  };
}
