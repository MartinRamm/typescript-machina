import { describe, expect, jest, test } from '@jest/globals';
import { expectTypeOf } from 'expect-type';
import { fsm } from '../../../src';
import { FsmBuilder } from '../../../src/builder';

type States = 'stateZero' | 'stateOne' | 'stateTwo';
type Handlers = 'handlerA' | 'handlerB' | 'handlerC' | 'handlerD';
type Actions =
  | ''
  | 'stateZero.handlerA'
  | 'stateZero.handlerB'
  | 'stateZero.handlerC'
  | 'stateZero.handlerD'
  | 'stateOne.handlerA'
  | 'stateOne.handlerB'
  | 'stateOne.handlerC'
  | 'stateOne.handlerD'
  | 'stateTwo.handlerA'
  | 'stateTwo.handlerB'
  | 'stateTwo.handlerC'
  | 'stateTwo.handlerD';

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
        describe('event0', () => {
          test('emit', () => {
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

          test('tsc accepts correct arguments', () => {
            builder.addInitializeFn(function () {
              this.on('event0', () => {});
            });
          });

          test('tsc must fail with wrong parameters', () => {
            builder.addInitializeFn(function () {
              //@ts-expect-error
              this.on('event0', (p0: number) => {});
              //@ts-expect-error
              this.on('event0', (p0: boolean) => {});
              //@ts-expect-error
              this.on('event0', (p0: object) => {});
              //@ts-expect-error
              this.on('event0', (p0: string) => {});
            });
          });
        });

        describe('event1', () => {
          test('emit', () => {
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

          test('tsc accepts correct arguments', () => {
            builder.addInitializeFn(function () {
              this.on('event1', num => {
                expectTypeOf(num).toBeString();
              });
            });
          });

          test('tsc must fail with wrong parameters', () => {
            builder.addInitializeFn(function () {
              //@ts-expect-error
              this.on('event1', (p0: number) => {});
              //@ts-expect-error
              this.on('event1', (p0: boolean) => {});
              //@ts-expect-error
              this.on('event1', (p0: object) => {});
              //@ts-expect-error
              this.on('event1', (p0: string, p1: string) => {});
            });
          });
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
        test('tsc arguments for generic listener', () => {
          builder.addInitializeFn(function () {
            this.on('*', (eventName, ...params) => {
              expectTypeOf(eventName).toEqualTypeOf(
                undefined as unknown as
                  | 'event0'
                  | 'event1'
                  | 'transition'
                  | 'transitioned'
                  | 'handling'
                  | 'handled'
                  | 'nohandler'
                  | 'invalidstate'
                  | 'deferred'
              );

              //event0
              expectTypeOf<[]>().toMatchTypeOf(params);
              //event1
              expectTypeOf<[string]>().toMatchTypeOf(params);
              //handling (as an example of an internal event)
              expectTypeOf<
                [
                  {
                    inputType: States;
                    delegated: boolean;
                    ticket: unknown;
                    namespace: string;
                  }
                ]
              >().toMatchTypeOf(params);
            });
          });
        });

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

        describe('transition/transitioned', () => {
          test('tsc correctly inferres arguments', () => {
            (['transition', 'transitioned'] as const).forEach(event =>
              builder.addInitializeFn(function () {
                this.on(event, param => {
                  expectTypeOf(param).toHaveProperty('fromState');
                  expectTypeOf<States | undefined>().toEqualTypeOf(param.fromState);

                  expectTypeOf(param).toHaveProperty('toState');
                  expectTypeOf<States>().toEqualTypeOf(param.toState);

                  expectTypeOf(param).toHaveProperty('action');
                  expectTypeOf<Actions>().toEqualTypeOf(param.action);

                  expectTypeOf(param).toHaveProperty('namespace');
                  expectTypeOf(param.namespace).toBeString();
                });
              })
            );
          });

          const dataTransitionInit = (namespace: string) => ({
            action: '',
            fromState: undefined,
            toState: 'stateZero',
            namespace,
          });
          const dataTransitionToStateOne = (namespace: string) => ({
            action: 'stateZero.handlerA',
            fromState: 'stateZero',
            toState: 'stateOne',
            namespace,
          });

          const mockOnEnterStateZero = jest.fn();
          const mockOnEnterStateOne = jest.fn();

          const mockWithReturn = () =>
            jest.fn(function () {
              return { zero: mockOnEnterStateZero.mock.calls.length, one: mockOnEnterStateOne.mock.calls.length };
            });

          const buildAndInitWithOnEnterMocks = <
            F extends typeof builder extends FsmBuilder<infer States> ? FsmBuilder<States> : never
          >(
            b: F
          ) => {
            const factory = b.build({
              stateZero: fsm.defineState({ _onEnter: mockOnEnterStateZero }),
              stateOne: fsm.defineState({ _onEnter: mockOnEnterStateOne }),
              stateTwo: fsm.defineState({}),
            });
            return new factory();
          };

          test('specific listener', () => {
            const mockFnBefore = mockWithReturn();
            const mockFnAfter = mockWithReturn();

            const b = builder.addDefaultHandler('handlerA', 'stateOne').addInitializeFn(function () {
              this.on('transition', mockFnBefore);
              this.on('transitioned', mockFnAfter);
            });
            const i = buildAndInitWithOnEnterMocks(b);
            i.handle('handlerA');

            //transition is called BEFORE _onEnter of new state is executed
            expect(mockFnBefore).toHaveBeenCalledTimes(2);
            expect(mockFnBefore).toHaveBeenNthCalledWith(1, dataTransitionInit(i.namespace));
            expect(mockFnBefore).toHaveNthReturnedWith(1, { zero: 0, one: 0 });
            expect(mockFnBefore).toHaveBeenNthCalledWith(2, dataTransitionToStateOne(i.namespace));
            expect(mockFnBefore).toHaveNthReturnedWith(2, { zero: 1, one: 0 });

            //transitioned is called AFTER _onEnter of new state is executed
            expect(mockFnAfter).toHaveBeenCalledTimes(2);
            expect(mockFnAfter).toHaveBeenNthCalledWith(1, dataTransitionInit(i.namespace));
            expect(mockFnAfter).toHaveNthReturnedWith(1, { zero: 1, one: 0 });
            expect(mockFnAfter).toHaveBeenNthCalledWith(2, dataTransitionToStateOne(i.namespace));
            expect(mockFnAfter).toHaveNthReturnedWith(2, { zero: 1, one: 1 });
          });

          test('generic listener', () => {
            const mockFn = jest.fn();
            const b = builder.addDefaultHandler('handlerA', 'stateOne').addInitializeFn(function () {
              this.on('*', mockFn);
            });
            const i = buildAndInitWithOnEnterMocks(b);
            i.handle('handlerA');

            expect(mockFn).toHaveBeenCalledWith('transition', dataTransitionInit(i.namespace));
            expect(mockFn).toHaveBeenCalledWith('transitioned', dataTransitionInit(i.namespace));

            expect(mockFn).toHaveBeenCalledWith('transition', dataTransitionToStateOne(i.namespace));
            expect(mockFn).toHaveBeenCalledWith('transitioned', dataTransitionToStateOne(i.namespace));
          });
        });

        describe('handling/handled', () => {
          test('tsc correctly inferres arguments', () => {
            (['handling', 'handled'] as const).forEach(event =>
              builder.addInitializeFn(function () {
                this.on(event, param => {
                  expectTypeOf(param).toHaveProperty('inputType');
                  expectTypeOf<Handlers>().toEqualTypeOf(param.inputType);

                  expectTypeOf(param).toHaveProperty('delegated');
                  expectTypeOf<boolean>().toEqualTypeOf(param.delegated);

                  expectTypeOf(param).toHaveProperty('ticket');
                  expectTypeOf<unknown>().toEqualTypeOf(param.ticket);

                  expectTypeOf(param).toHaveProperty('namespace');
                  expectTypeOf(param.namespace).toBeString();
                });
              })
            );
          });

          const data = (namespace: string) => ({
            inputType: 'handlerA',
            delegated: false,
            ticket: undefined,
            namespace,
          });

          test('specific listener', () => {
            const mockFnBefore = jest.fn(function () {
              //@ts-ignore
              //eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
              return this.state;
            });
            const mockFnAfter = jest.fn(function () {
              //@ts-ignore
              //eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
              return this.state;
            });

            const b = builder.addDefaultHandler('handlerA', 'stateOne').addInitializeFn(function () {
              this.on('handling', mockFnBefore);
              this.on('handled', mockFnAfter);
            });
            const i = buildAndInit(b);
            i.handle('handlerA');

            //handling is called BEFORE the input handler is invoked
            expect(mockFnBefore).toHaveBeenCalledTimes(1);
            expect(mockFnBefore).toHaveBeenNthCalledWith(1, data(i.namespace));
            expect(mockFnBefore).toHaveNthReturnedWith(1, 'stateZero');

            //handled is called AFTER the input handler is invoked
            expect(mockFnAfter).toHaveBeenCalledTimes(1);
            expect(mockFnAfter).toHaveBeenNthCalledWith(1, data(i.namespace));
            expect(mockFnAfter).toHaveNthReturnedWith(1, 'stateOne');
          });

          test('generic listener', () => {
            const mockFn = jest.fn();
            const b = builder.addDefaultHandler('handlerA', 'stateOne').addInitializeFn(function () {
              this.on('*', mockFn);
            });
            const i = buildAndInit(b);
            i.handle('handlerA');

            expect(mockFn).toHaveBeenCalledWith('handling', data(i.namespace));
            expect(mockFn).toHaveBeenCalledWith('handled', data(i.namespace));
          });
        });

        describe('nohandler', () => {
          test('tsc correctly inferres arguments', () => {
            builder.addInitializeFn(function () {
              this.on('nohandler', param => {
                expectTypeOf(param).toHaveProperty('inputType');
                expectTypeOf<string>().toEqualTypeOf(param.inputType);

                expectTypeOf(param).toHaveProperty('delegated');
                expectTypeOf<boolean>().toEqualTypeOf(param.delegated);

                expectTypeOf(param).toHaveProperty('ticket');
                expectTypeOf<unknown>().toEqualTypeOf(param.ticket);

                expectTypeOf(param).toHaveProperty('namespace');
                expectTypeOf(param.namespace).toBeString();
              });
            });
          });

          const handler = 'does-not-exist';
          const data = (namespace: string) => ({
            args: expect.arrayContaining([]), //untyped
            inputType: handler,
            delegated: false,
            ticket: undefined,
            namespace,
          });

          test('specific listener', () => {
            const mockFn = jest.fn();
            const b = builder.addInitializeFn(function () {
              this.on('nohandler', mockFn);
            });
            const i = buildAndInit(b);
            i.handle(handler);

            expect(mockFn).toHaveBeenCalledTimes(1);
            //@ts-ignore
            expect(mockFn).toHaveBeenCalledWith(data(i.namespace));
          });

          test('generic listener', () => {
            const mockFn = jest.fn();
            const b = builder.addInitializeFn(function () {
              this.on('*', mockFn);
            });
            const i = buildAndInit(b);
            //@ts-ignore
            i.handle(handler);

            expect(mockFn).toHaveBeenCalledWith('nohandler', data(i.namespace));
          });
        });

        describe('invalidstate', () => {
          test('tsc correctly inferres arguments', () => {
            builder.addInitializeFn(function () {
              this.on('invalidstate', param => {
                expectTypeOf(param).toHaveProperty('state');
                expectTypeOf<States>().toEqualTypeOf(param.state);

                expectTypeOf(param).toHaveProperty('attemptedState');
                expectTypeOf(param.attemptedState).toBeString();

                expectTypeOf(param).toHaveProperty('namespace');
                expectTypeOf(param.namespace).toBeString();
              });
            });
          });

          const state = 'invalid-state';
          const data = (namespace: string) => ({
            state: 'stateZero',
            attemptedState: state,
            namespace,
          });

          test('specific listener', () => {
            const mockFn = jest.fn();
            const b = builder.addInitializeFn(function () {
              this.on('invalidstate', mockFn);
            });
            const i = buildAndInit(b);
            //@ts-ignore
            i.transition(state);

            expect(mockFn).toHaveBeenCalledTimes(1);
            expect(mockFn).toHaveBeenCalledWith(data(i.namespace));
          });

          test('generic listener', () => {
            const mockFn = jest.fn();
            const b = builder.addInitializeFn(function () {
              this.on('*', mockFn);
            });
            const i = buildAndInit(b);
            //@ts-ignore
            i.transition(state);

            expect(mockFn).toHaveBeenCalledWith('invalidstate', data(i.namespace));
          });
        });

        describe('deferred', () => {
          test('tsc correctly inferres arguments', () => {
            builder.addInitializeFn(function () {
              this.on('deferred', param => {
                expectTypeOf(param).toHaveProperty('state');
                expectTypeOf<States>().toEqualTypeOf(param.state);

                expectTypeOf(param).toHaveProperty('queuedArgs');

                expectTypeOf(param.queuedArgs).toHaveProperty('type');
                expectTypeOf<'transition'>().toEqualTypeOf(param.queuedArgs.type);

                expectTypeOf(param.queuedArgs).toHaveProperty('untilState');
                expectTypeOf<undefined | [States]>().toEqualTypeOf(param.queuedArgs.untilState);

                expectTypeOf(param.queuedArgs).toHaveProperty('args');
                expectTypeOf(param.queuedArgs.args[0]).toHaveProperty('inputType');
                expectTypeOf<Handlers>().toEqualTypeOf(param.queuedArgs.args[0].inputType);
                expectTypeOf(param.queuedArgs.args[0]).toHaveProperty('delegated');
                expectTypeOf<boolean>().toEqualTypeOf(param.queuedArgs.args[0].delegated);
                expectTypeOf(param.queuedArgs.args[0]).toHaveProperty('ticket');
                expectTypeOf<any>().toEqualTypeOf(param.queuedArgs.args[0].ticket);

                expectTypeOf(param).toHaveProperty('namespace');
                expectTypeOf(param.namespace).toBeString();
              });
            });
          });

          const param = 123;
          const data = (namespace: string) => ({
            state: 'stateZero',
            queuedArgs: {
              type: 'transition',
              untilState: ['stateOne'],
              args: [{ inputType: 'handlerD', delegated: false, ticket: undefined }, param],
            },
            namespace,
          });

          test('specific listener', () => {
            const mockFn = jest.fn();
            const b = builder
              .addDefaultHandler('handlerD', function (input) {
                this.deferUntilTransition('stateOne');
              })
              .addInitializeFn(function () {
                this.on('deferred', mockFn);
              });
            const i = buildAndInit(b);
            i.handle('handlerD', param);

            expect(mockFn).toHaveBeenCalledTimes(1);
            expect(mockFn).toHaveBeenCalledWith(data(i.namespace));
          });

          test('generic listener', () => {
            const mockFn = jest.fn();
            const b = builder
              .addDefaultHandler('handlerD', function (input) {
                this.deferUntilTransition('stateOne');
              })
              .addInitializeFn(function () {
                this.on('*', mockFn);
              });
            const i = buildAndInit(b);
            i.handle('handlerD', param);

            expect(mockFn).toHaveBeenCalledWith('deferred', data(i.namespace));
          });
        });
      });

      describe('off', () => {
        test('internal event', () => {
          const mockFn = jest.fn();
          const b = builder.addInitializeFn(function () {
            this.on('invalidstate', mockFn);
            // @ts-ignore
            this.transition('does-not-exist');

            this.off('invalidstate', mockFn);
            // @ts-ignore
            this.transition('does-not-exist');
          });
          buildAndInit(b);

          expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('custom event', () => {
          const mockFn = jest.fn();
          const b = builder.addInitializeFn(function () {
            this.on('event0', mockFn);
            this.emit('event0');

            this.off('event0', mockFn);
            this.emit('event0');
          });
          buildAndInit(b);

          expect(mockFn).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
