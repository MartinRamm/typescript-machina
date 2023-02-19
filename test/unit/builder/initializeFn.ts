import { describe, expect, jest, test } from '@jest/globals';
import { expectTypeOf } from 'expect-type';
import { fsm } from '../../../src';
import { FsmBuilder } from '../../../src/builder';

describe('initializeFn', () => {
  const builder = fsm.builder({
    states: {
      stateZero: fsm.state(),
      stateOne: fsm.state(),
      stateTwo: fsm.state(),
    },
    handlers: {
      handlerA: fsm.handler(),
      handlerB: fsm.handler(),
      handlerC: fsm.handler(),
    },
    events: {
      event1: fsm.event(),
      event2: fsm.event(),
      event3: fsm.event(),
    },
    initialState: 'stateZero',
  });
  const build = <F extends typeof builder extends FsmBuilder<infer States> ? FsmBuilder<States> : never>(b: F) =>
    b.build({
      stateZero: fsm.defineState({}),
      stateOne: fsm.defineState({}),
      stateTwo: fsm.defineState({}),
    });
  const buildAndInit = <F extends typeof builder extends FsmBuilder<infer States> ? FsmBuilder<States> : never>(
    b: F
  ) => {
    const factory = build(b);
    return new factory();
  };
  test('function is called', () => {
    const mockFn = jest.fn();
    const b = builder.addInitializeFn(mockFn);
    buildAndInit(b);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  describe('this', () => {
    describe('properties', () => {
      test('states', () => {
        const b = builder.addInitializeFn(function () {
          expectTypeOf(this).toHaveProperty('states');
          expect(this).toHaveProperty('states');

          expectTypeOf(this.states).toHaveProperty('stateZero');
          expect(this.states).toHaveProperty('stateZero');

          expectTypeOf(this.states).toHaveProperty('stateOne');
          expect(this.states).toHaveProperty('stateOne');

          expectTypeOf(this.states).toHaveProperty('stateTwo');
          expect(this.states).toHaveProperty('stateTwo');
        });
        buildAndInit(b);
      });
      test('initialState', () => {
        const b = builder.addInitializeFn(function () {
          expectTypeOf(this).toHaveProperty('initialState');
          expect(this).toHaveProperty('initialState');
          expectTypeOf(this.initialState).toEqualTypeOf('stateZero' as const);
          expect(this.initialState).toEqual('stateZero');
        });
        buildAndInit(b);
      });
      test('eventListeners', () => {
        const b = builder.addInitializeFn(function () {
          expectTypeOf(this).toHaveProperty('eventListeners');
          expect(this).toHaveProperty('eventListeners');
          expectTypeOf(this.eventListeners).toBeObject();
          expect(typeof this.eventListeners).toEqual('object');
        });
        buildAndInit(b);
      });
      test('namespace', () => {
        const b = builder.addInitializeFn(function () {
          expectTypeOf(this).toHaveProperty('namespace');
          expect(this).toHaveProperty('namespace');
          expectTypeOf(this.namespace).toBeString();
          expect(typeof this.namespace).toEqual('string');
        });
        buildAndInit(b);
      });
      test('useSafeEmit', () => {
        const b = builder.addInitializeFn(function () {
          expectTypeOf(this).toHaveProperty('useSafeEmit');
          expect(this).toHaveProperty('useSafeEmit');
          expectTypeOf(this.useSafeEmit).toBeBoolean();
          expect(typeof this.useSafeEmit).toEqual('boolean');
        });
        buildAndInit(b);
      });
      test('hierarchy', () => {
        const b = builder.addInitializeFn(function () {
          expectTypeOf(this).toHaveProperty('hierarchy');
          expect(this).toHaveProperty('hierarchy');
          expectTypeOf(this.hierarchy).toBeObject();
          expect(typeof this.hierarchy).toEqual('object');
        });
        buildAndInit(b);
      });
      test('pendingDelegations', () => {
        const b = builder.addInitializeFn(function () {
          expectTypeOf(this).toHaveProperty('pendingDelegations');
          expect(this).toHaveProperty('pendingDelegations');
          expectTypeOf(this.pendingDelegations).toBeObject();
          expect(typeof this.pendingDelegations).toEqual('object');
        });
        buildAndInit(b);
      });
      test('no untyped defined properties', () => {
        const b = builder.addInitializeFn(function () {
          expect(Object.keys(this).length).toEqual(
            ['states', 'initialState', 'eventListeners', 'namespace', 'useSafeEmit', 'hierarchy', 'pendingDelegations']
              .length
          );
        });
        buildAndInit(b);
      });
    });

    describe('functions', () => {
      test('initialize', () => {
        const b = builder.addInitializeFn(function () {
          expectTypeOf(this).toHaveProperty('initialize');
          expect(this).toHaveProperty('initialize');
          expectTypeOf(this.initialize).toBeFunction();
          expect(typeof this.initialize).toEqual('function');
        });
        buildAndInit(b);
      });

      describe('transition', () => {
        test('tsc must fail on non-defined state', () => {
          builder.addInitializeFn(function () {
            //@ts-expect-error
            this.transition('does-not-exist');
            //@ts-expect-error
            this.transition('handlerA');
            //@ts-expect-error
            this.transition('event0');
          });
        });

        ['stateZero' as const, 'stateOne' as const, 'stateTwo' as const].forEach(state =>
          test(`works with defined state: ${state}`, () => {
            const b = builder.addInitializeFn(function () {
              this.transition(state);
            });
            const i = buildAndInit(b);
            expect(i.state).toEqual(state);
          })
        );
      });

      describe('handle', () => {});

      describe('emit', () => {});

      describe('on', () => {});

      describe('off', () => {});
    });
  });
});
