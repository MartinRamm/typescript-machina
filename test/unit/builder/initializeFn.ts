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
    describe('no params', () => {
      const b = builder.addInitializeFn(() => {});
      const buildResult = b.build({
        init: fsm.defineState({}),
      });

      test('tsc must fail on wrong argument', () => {
        //@ts-expect-error
        new buildResult(123);
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

      test('tsc must succeed on correct argument', () => {
        new buildResult();
      });
    });

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

      test('tsc must succeed on correct argument', () => {
        new buildResult(3);
      });
    });

    describe('two params', () => {
      const b = builder.addInitializeFn((p0: number, p1: string) => {});
      const buildResult = b.build({
        init: fsm.defineState({}),
      });

      test('tsc must fail on missing argument', () => {
        //@ts-expect-error
        new buildResult();
      });

      test('tsc must fail on wrong argument', () => {
        //@ts-expect-error
        new buildResult(123);
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
        //@ts-expect-error
        new buildResult(123, true);
        //@ts-expect-error
        new buildResult('test', 123);
        //@ts-expect-error
        new buildResult(123, null);
        //@ts-expect-error
        new buildResult(123, 123);
        //@ts-expect-error
        new buildResult('123', '456');
      });

      test('tsc must succeed on correct argument', () => {
        new buildResult(1, 'two');
      });
    });

    describe('optional params', () => {
      const b = builder.addInitializeFn((p0: number, p1?: string) => {});
      const buildResult = b.build({
        init: fsm.defineState({}),
      });

      test('tsc must fail on missing argument', () => {
        //@ts-expect-error
        new buildResult();
      });

      test('tsc must fail on wrong argument', () => {
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
        //@ts-expect-error
        new buildResult(123, true);
        //@ts-expect-error
        new buildResult('test', 123);
        //@ts-expect-error
        new buildResult(123, null);
        //@ts-expect-error
        new buildResult(123, 123);
        //@ts-expect-error
        new buildResult('123', '456');
      });

      test('tsc must succeed on correct argument (with optional)', () => {
        new buildResult(1, 'two');
      });

      test('tsc must succeed on correct argument (without optional)', () => {
        new buildResult(1);
      });
    });

    describe('varargs', () => {
      const b = builder.addInitializeFn((...p: number[]) => {});
      const buildResult = b.build({
        init: fsm.defineState({}),
      });

      test('tsc must fail on wrong argument', () => {
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
        //@ts-expect-error
        new buildResult(123, true);
        //@ts-expect-error
        new buildResult('test', 123);
        //@ts-expect-error
        new buildResult(123, null);
        //@ts-expect-error
        new buildResult('123', '456');
      });

      test('tsc must succeed on correct argument (one param)', () => {
        new buildResult(1);
      });

      test('tsc must succeed on correct argument (two params)', () => {
        new buildResult(1, 2);
      });

      test('tsc must succeed on correct argument (three params)', () => {
        new buildResult(1, 2, 3);
      });
    });
  });
});
