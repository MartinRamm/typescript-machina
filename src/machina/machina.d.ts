import type { FsmBuilder as TypescriptFsm } from '../../builder';
import type { InstantiatableMachina } from './InstantiatableMachina';

//eslint-disable-next-line @typescript-eslint/naming-convention
const Fsm: {
  extend<F extends TypescriptFsm>(params: object): InstantiatableMachina<F>;
};

//eslint-disable-next-line import/no-default-export
export default {
  //eslint-disable-next-line @typescript-eslint/naming-convention
  Fsm,
};
