import { fsm } from '../../../src';
import { regexpBuilder } from './regexp';

export const fail = fsm.defineState<typeof regexpBuilder, 'fail'>({
  char: fsm.handlerFn(function (char) {
    if (char === 'a') {
      this.transition('a');
    }
  }),
});
