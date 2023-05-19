import { fsm } from '../../../src';
import { fail } from './fail';
import { a } from './a';
import { b } from './b';
import { success } from './success';

//this fsm represents the regular expression /a+b+c+/g

export const regexpBuilder = fsm
  .builder({
    states: {
      fail: fsm.state(),
      a: fsm.state(),
      b: fsm.state(),
      success: fsm.state(),
    },
    initialState: 'fail',
    handlers: {
      char: fsm.handler<[string]>(),
      endOfInput: fsm.handler(),
    },
  })
  .addDefaultHandler('endOfInput', function () {
    this.transition('fail');
  })
  .addUserDefinedFn('match', function (input: string): boolean {
    this.transition('fail'); //reset

    input.split('').forEach(char => this.handle('char', char));
    this.handle('endOfInput');
    return this.state === 'success';
  });

export const regexp = regexpBuilder.build({
  fail,
  a,
  b,
  success,
});
