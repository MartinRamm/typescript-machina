import { describe, expect, jest, test } from '@jest/globals';
import { fsm } from '../../../src';

describe('any handler by using fsm.anyHandler()', () => {
  test('handle', () => {
    const mockFn = jest.fn();
    const name = 'undefinedHandler';

    const factory = fsm
      .builder({
        states: {
          init: fsm.state(),
        },
        initialState: 'init',
        handlers: fsm.anyHandler(),
      })
      .build({
        init: fsm.defineState({
          [name]: fsm.handlerFn(mockFn),
        }),
      });
    const i = new factory();
    i.handle(name);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  //TODO add more
});
