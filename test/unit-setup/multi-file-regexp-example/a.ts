import { fsm } from '../../../src';
import { regexpBuilder } from './regexp';

export const a = fsm.defineState<typeof regexpBuilder, 'a'>({
  char: fsm.handlerFn(function (char) {
    if (char === 'b') {
      this.transition('b');
    } else if (char !== 'a') {
      this.transition('fail');
    }
  }),
});
