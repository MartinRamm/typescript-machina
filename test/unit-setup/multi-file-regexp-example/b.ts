import { fsm } from '../../../src';
import { regexpBuilder } from './regexp';

export const b = fsm.defineState<typeof regexpBuilder, 'b'>({
  char: fsm.handlerFn(function (char) {
    if (char === 'c') {
      this.transition('success');
    } else if (char !== 'b') {
      this.deferAndTransition('fail');
    }
  }),
});
