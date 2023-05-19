import { fsm } from '../../../src';
import { regexpBuilder } from './regexp';

export const success = fsm.defineState<typeof regexpBuilder, 'success'>({
  endOfInput: fsm.handlerFn(function () {}),
});
