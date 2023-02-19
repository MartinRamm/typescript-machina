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
      handlerD: fsm.handler<[number]>(),
    },
    events: {
      event0: fsm.event(),
      event1: fsm.event<[string]>(),
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

      describe('handle', () => {
        test('tsc must fail on non-defined handler (no parameters)', () => {
          builder.addInitializeFn(function () {
            //@ts-expect-error
            this.handle('does-not-exist');
            //@ts-expect-error
            this.handle('stateZero');
            //@ts-expect-error
            this.handle('event0');
          });
        });

        test('tsc must fail on non-defined handler (with parameters)', () => {
          builder.addInitializeFn(function () {
            //@ts-expect-error
            this.handle('does-not-exist', 123);
            //@ts-expect-error
            this.handle('does-not-exist', true);
            //@ts-expect-error
            this.handle('does-not-exist', false);
            //@ts-expect-error
            this.handle('does-not-exist', undefined);
            //@ts-expect-error
            this.handle('does-not-exist', null);
            //@ts-expect-error
            this.handle('does-not-exist', 'test');
            //@ts-expect-error
            this.handle('does-not-exist', { one: 'two' });
          });
        });

        test('tsc must fail with wrong parameters for handlerA', () => {
          builder.addInitializeFn(function () {
            //@ts-expect-error
            this.handle('handlerA', 123);
            //@ts-expect-error
            this.handle('handlerA', true);
            //@ts-expect-error
            this.handle('handlerA', false);
            //@ts-expect-error
            this.handle('handlerA', undefined);
            //@ts-expect-error
            this.handle('handlerA', null);
            //@ts-expect-error
            this.handle('handlerA', 'test');
            //@ts-expect-error
            this.handle('handlerA', { one: 'two' });
          });
        });
        test('tsc must fail with wrong parameters for handlerB', () => {
          builder.addInitializeFn(function () {
            //@ts-expect-error
            this.handle('handlerB', 123);
            //@ts-expect-error
            this.handle('handlerB', true);
            //@ts-expect-error
            this.handle('handlerB', false);
            //@ts-expect-error
            this.handle('handlerB', undefined);
            //@ts-expect-error
            this.handle('handlerB', null);
            //@ts-expect-error
            this.handle('handlerB', 'test');
            //@ts-expect-error
            this.handle('handlerB', { one: 'two' });
          });
        });
        test('tsc must fail with wrong parameters for handlerC', () => {
          builder.addInitializeFn(function () {
            //@ts-expect-error
            this.handle('handlerC', 123);
            //@ts-expect-error
            this.handle('handlerC', true);
            //@ts-expect-error
            this.handle('handlerC', false);
            //@ts-expect-error
            this.handle('handlerC', undefined);
            //@ts-expect-error
            this.handle('handlerC', null);
            //@ts-expect-error
            this.handle('handlerC', 'test');
            //@ts-expect-error
            this.handle('handlerC', { one: 'two' });
          });
        });
        test('tsc must fail with wrong parameters for handlerD', () => {
          builder.addInitializeFn(function () {
            //@ts-expect-error
            this.handle('handlerD');
            //@ts-expect-error
            this.handle('handlerD', 123, 123);
            //@ts-expect-error
            this.handle('handlerD', true);
            //@ts-expect-error
            this.handle('handlerD', false);
            //@ts-expect-error
            this.handle('handlerD', undefined);
            //@ts-expect-error
            this.handle('handlerD', null);
            //@ts-expect-error
            this.handle('handlerD', 'test');
            //@ts-expect-error
            this.handle('handlerD', { one: 'two' });
          });
        });

        test('handle for handlerA', () => {
          const mockFn = jest.fn();
          const b = builder.addDefaultHandler('handlerA', mockFn).addInitializeFn(function () {
            this.handle('handlerA');
          });
          buildAndInit(b);
          expect(mockFn).toHaveBeenCalledTimes(1);
          expect(mockFn).toHaveBeenLastCalledWith();
        });
        test('handle for handlerB', () => {
          const mockFn = jest.fn();
          const b = builder.addDefaultHandler('handlerB', mockFn).addInitializeFn(function () {
            this.handle('handlerB');
          });
          buildAndInit(b);
          expect(mockFn).toHaveBeenCalledTimes(1);
          expect(mockFn).toHaveBeenLastCalledWith();
        });
        test('handle for handlerC', () => {
          const mockFn = jest.fn();
          const b = builder.addDefaultHandler('handlerC', mockFn).addInitializeFn(function () {
            this.handle('handlerC');
          });
          buildAndInit(b);
          expect(mockFn).toHaveBeenCalledTimes(1);
          expect(mockFn).toHaveBeenLastCalledWith();
        });
        test('handle for handlerD', () => {
          const param = 123;
          const mockFn = jest.fn();
          const b = builder.addDefaultHandler('handlerD', mockFn).addInitializeFn(function () {
            this.handle('handlerD', param);
          });
          buildAndInit(b);
          expect(mockFn).toHaveBeenCalledTimes(1);
          expect(mockFn).toHaveBeenLastCalledWith(param);
        });
      });

      describe('emit', () => {
        test('tsc must fail on non-defined event (no parameters)', () => {
          builder.addInitializeFn(function () {
            //@ts-expect-error
            this.emit('does-not-exist');
            //@ts-expect-error
            this.emit('stateZero');
            //@ts-expect-error
            this.emit('handlerA');
          });
        });
        test('tsc must fail on non-defined event (with parameters)', () => {
          builder.addInitializeFn(function () {
            //@ts-expect-error
            this.emit('does-not-exist', 123);
            //@ts-expect-error
            this.emit('does-not-exist', true);
            //@ts-expect-error
            this.emit('does-not-exist', false);
            //@ts-expect-error
            this.emit('does-not-exist', undefined);
            //@ts-expect-error
            this.emit('does-not-exist', null);
            //@ts-expect-error
            this.emit('does-not-exist', 'test');
            //@ts-expect-error
            this.emit('does-not-exist', { one: 'two' });
          });
        });

        test('tsc must fail with wrong parameters for event0', () => {
          builder.addInitializeFn(function () {
            //@ts-expect-error
            this.emit('event0', 123);
            //@ts-expect-error
            this.emit('event0', true);
            //@ts-expect-error
            this.emit('event0', false);
            //@ts-expect-error
            this.emit('event0', undefined);
            //@ts-expect-error
            this.emit('event0', null);
            //@ts-expect-error
            this.emit('event0', 'test');
            //@ts-expect-error
            this.emit('event0', { one: 'two' });
          });
        });
        test('tsc must fail with wrong parameters for event1', () => {
          builder.addInitializeFn(function () {
            //@ts-expect-error
            this.emit('event1', 123);
            //@ts-expect-error
            this.emit('event1', true);
            //@ts-expect-error
            this.emit('event1', false);
            //@ts-expect-error
            this.emit('event1', undefined);
            //@ts-expect-error
            this.emit('event1', null);
            //@ts-expect-error
            this.emit('event1');
            //@ts-expect-error
            this.emit('event1', 'test', 'test');
            //@ts-expect-error
            this.emit('event1', { one: 'two' });
          });
        });
      });

      describe('emit / on (custom events)', () => {
        test('emit event0', () => {
          const mockFnListenerSpecific = jest.fn();
          const mockFnListenerGeneric = jest.fn();
          const b = builder.addInitializeFn(function () {
            this.on('event0', mockFnListenerSpecific);
            this.on('*', mockFnListenerGeneric);
            this.emit('event0');
          });
          buildAndInit(b);

          expect(mockFnListenerSpecific).toHaveBeenCalledTimes(1);
          expect(mockFnListenerSpecific).toHaveBeenCalledWith();

          expect(mockFnListenerGeneric).toHaveBeenCalledWith('event0');
        });

        test('emit event1', () => {
          const param = 'asdf';

          const mockFnListenerSpecific = jest.fn();
          const mockFnListenerGeneric = jest.fn();
          const b = builder.addInitializeFn(function () {
            this.on('event1', mockFnListenerSpecific);
            this.on('*', mockFnListenerGeneric);
            this.emit('event1', param);
          });
          buildAndInit(b);

          expect(mockFnListenerSpecific).toHaveBeenCalledTimes(1);
          expect(mockFnListenerSpecific).toHaveBeenCalledWith(param);

          expect(mockFnListenerGeneric).toHaveBeenCalledWith('event1', param);
        });

        describe('this context in event handler fn', () => {
          test('properties', () => {
            const b = builder.addInitializeFn(function () {
              this.on('event0', function () {
                expect(this).toHaveProperty('states');
                expectTypeOf(this).toHaveProperty('states');

                expect(this).toHaveProperty('initialState');
                expectTypeOf(this).toHaveProperty('initialState');

                expect(this).toHaveProperty('eventListeners');
                expectTypeOf(this).toHaveProperty('eventListeners');

                expect(this).toHaveProperty('namespace');
                expectTypeOf(this).toHaveProperty('namespace');

                expect(this).toHaveProperty('useSafeEmit');
                expectTypeOf(this).toHaveProperty('useSafeEmit');

                expect(this).toHaveProperty('hierarchy');
                expectTypeOf(this).toHaveProperty('hierarchy');

                expect(this).toHaveProperty('pendingDelegations');
                expectTypeOf(this).toHaveProperty('pendingDelegations');

                expect(Object.keys(this).length).toEqual(
                  [
                    'states',
                    'initialState',
                    'eventListeners',
                    'namespace',
                    'useSafeEmit',
                    'hierarchy',
                    'pendingDelegations',
                  ].length
                );
              });

              this.emit('event0');
            });
            buildAndInit(b);
          });

          test('functions', () => {
            const b = builder.addInitializeFn(function () {
              this.on('transition', function () {
                expect(this).toHaveProperty('transition');
                expectTypeOf(this).toHaveProperty('transition');
                expect(typeof this.transition).toEqual('function');
                expectTypeOf(this.transition).toBeFunction();

                expect(this).toHaveProperty('handle');
                expectTypeOf(this).toHaveProperty('handle');
                expect(typeof this.handle).toEqual('function');
                expectTypeOf(this.handle).toBeFunction();

                expect(this).toHaveProperty('emit');
                expectTypeOf(this).toHaveProperty('emit');
                expect(typeof this.emit).toEqual('function');
                expectTypeOf(this.emit).toBeFunction();

                expect(this).toHaveProperty('on');
                expectTypeOf(this).toHaveProperty('on');
                expect(typeof this.on).toEqual('function');
                expectTypeOf(this.on).toBeFunction();

                expect(this).toHaveProperty('off');
                expectTypeOf(this).toHaveProperty('off');
                expect(typeof this.off).toEqual('function');
                expectTypeOf(this.off).toBeFunction();
              });
            });
            buildAndInit(b);
          });
        });
      });

      describe('on (internal events)', () => {
        describe('this context in event handler fn', () => {
          test('properties', () => {
            const b = builder.addInitializeFn(function () {
              this.on('transition', function () {
                expect(this).toHaveProperty('states');
                expectTypeOf(this).toHaveProperty('states');

                expect(this).toHaveProperty('initialState');
                expectTypeOf(this).toHaveProperty('initialState');

                expect(this).toHaveProperty('eventListeners');
                expectTypeOf(this).toHaveProperty('eventListeners');

                expect(this).toHaveProperty('namespace');
                expectTypeOf(this).toHaveProperty('namespace');

                expect(this).toHaveProperty('useSafeEmit');
                expectTypeOf(this).toHaveProperty('useSafeEmit');

                expect(this).toHaveProperty('hierarchy');
                expectTypeOf(this).toHaveProperty('hierarchy');

                expect(this).toHaveProperty('pendingDelegations');
                expectTypeOf(this).toHaveProperty('pendingDelegations');

                expect(this).toHaveProperty('inputQueue');
                expectTypeOf(this).toHaveProperty('inputQueue');

                expect(this).toHaveProperty('targetReplayState');
                expectTypeOf(this).toHaveProperty('targetReplayState');

                expect(this).toHaveProperty('state');
                expectTypeOf(this).toHaveProperty('state');

                expect(this).toHaveProperty('priorState');
                expectTypeOf(this).toHaveProperty('priorState');

                expect(this).toHaveProperty('priorAction');
                expectTypeOf(this).toHaveProperty('priorAction');

                expect(this).toHaveProperty('currentAction');
                expectTypeOf(this).toHaveProperty('currentAction');

                expect(this).toHaveProperty('currentActionArgs');
                expectTypeOf(this).toHaveProperty('currentActionArgs');

                expect(this).toHaveProperty('inExitHandler');
                expectTypeOf(this).toHaveProperty('inExitHandler');

                //@ts-ignore
                console.log('priorAction', this['priorAction']);
                console.log(Object.keys(this));
                expect(Object.keys(this).length).toEqual(
                  [
                    'states',
                    'initialState',
                    'eventListeners',
                    'namespace',
                    'useSafeEmit',
                    'hierarchy',
                    'pendingDelegations',
                    'inputQueue',
                    'targetReplayState',
                    'state',
                    'priorState',
                    'priorAction',
                    'currentAction',
                    'currentActionArgs',
                    'inExitHandler',

                    //NOT TYPED
                    '_stamped',
                  ].length
                );
              });
            });
            buildAndInit(b);
          });

          test('functions', () => {
            const b = builder.addInitializeFn(function () {
              this.on('event0', function () {
                expect(this).toHaveProperty('transition');
                expectTypeOf(this).toHaveProperty('transition');
                expect(typeof this.transition).toEqual('function');
                expectTypeOf(this.transition).toBeFunction();

                expect(this).toHaveProperty('handle');
                expectTypeOf(this).toHaveProperty('handle');
                expect(typeof this.handle).toEqual('function');
                expectTypeOf(this.handle).toBeFunction();

                expect(this).toHaveProperty('emit');
                expectTypeOf(this).toHaveProperty('emit');
                expect(typeof this.emit).toEqual('function');
                expectTypeOf(this.emit).toBeFunction();

                expect(this).toHaveProperty('on');
                expectTypeOf(this).toHaveProperty('on');
                expect(typeof this.on).toEqual('function');
                expectTypeOf(this.on).toBeFunction();

                expect(this).toHaveProperty('off');
                expectTypeOf(this).toHaveProperty('off');
                expect(typeof this.off).toEqual('function');
                expectTypeOf(this.off).toBeFunction();
              });

              this.emit('event0');
            });
            buildAndInit(b);
          });
        });
      });

      describe('off', () => {});
    });
  });
});
