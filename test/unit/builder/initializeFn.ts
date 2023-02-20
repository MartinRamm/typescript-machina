import { describe, expect, jest, test } from '@jest/globals';
import { fsm } from '../../../src';

describe('initializeFn', () => {
  const builder = fsm.builder({
    states: {
      init: fsm.state(),
    },
    handlers: {},
    events: {},
    initialState: 'init',
  });

  test('function is called', () => {
    const mockFn = jest.fn();
    const b = builder.addInitializeFn(mockFn);
    const buildResult = b.build({
      init: fsm.defineState({}),
    });
    const i = new buildResult();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('function is not required', () => {
    const buildResult = builder.build({
      init: fsm.defineState({}),
    });
    const i = new buildResult();
    expect(i.state).toEqual('init');
  });

  describe('constructor args', () => {
    describe('one param', () => {
      const b = builder.addInitializeFn((p0: number) => {});
      const buildResult = b.build({
        init: fsm.defineState({}),
      });

      test('tsc must fail on missing argument', () => {
        //@ts-expect-error
        new buildResult();
      });

      test('tsc must fail on wrong argument', () => {
        //@ts-expect-error
        new buildResult(123, 123);
        //@ts-expect-error
        new buildResult(true);
        //@ts-expect-error
        new buildResult(false);
        //@ts-expect-error
        new buildResult(undefined);
        //@ts-expect-error
        new buildResult(null);
        //@ts-expect-error
        new buildResult('test');
        //@ts-expect-error
        new buildResult({ one: 'two' });
      });
    });
  });
});
