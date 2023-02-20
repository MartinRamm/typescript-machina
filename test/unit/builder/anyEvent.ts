import { describe, expect, jest, test } from '@jest/globals';
import { fsm } from '../../../src';

describe('any event by using fsm.anyEvent()', () => {
  test('on/emit', () => {
    const mockFn = jest.fn();

    const factory = fsm
      .builder({
        states: {
          init: fsm.state(),
        },
        initialState: 'init',
        handlers: {},
        events: fsm.anyEvent(),
      })
      .build({
        init: fsm.defineState({}),
      });
    const i = new factory();
    i.on('test', mockFn);
    i.emit('test');

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  //TODO add more
});
