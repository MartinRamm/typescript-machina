import { describe, expect, test, jest } from '@jest/globals';
import { fsm } from '../../../src';

describe('any state by using fsm.anyState()', () => {
  describe('builder', () => {
    const builder = fsm
      .builder({
        states: fsm.anyState(),
        initialState: 'init',
        handlers: {
          eventA: fsm.handler(),
          eventB: fsm.handler(),
          eventC: fsm.handler(),
        },
      })
      .addInitializeFn(function () {
        this.transition('fourth');
      })
      .addUserDefinedFn('transitionToFourth', function () {
        this.transition('fourth');
      });
    describe('build', () => {
      const mockOnEnterFirst = jest.fn();
      const mockOnEnterSecond = jest.fn();
      const mockOnEnterThird = jest.fn();

      const mockEventAFirst = jest.fn();
      const mockEventCFirst = jest.fn();

      const factory = builder.build({
        init: fsm.defineState({
          eventA: fsm.handlerFn(function () {
            this.deferUntilTransition('first');
          }),
          eventB: fsm.handlerFn('first'),
          eventC: fsm.handlerFn(function () {
            this.deferAndTransition('first');
          }),
        }),
        first: fsm.defineState({
          _onEnter: mockOnEnterFirst,
          eventA: mockEventAFirst,
          eventC: mockEventCFirst,
        }),
        second: fsm.defineState({
          _onEnter: mockOnEnterSecond,
        }),
        third: fsm.defineState({
          _onEnter: mockOnEnterThird,
        }),
        fourth: fsm.defineState({}),
      });
      describe('instance', () => {
        const instance = new factory();
        test('initialize fn transition', () => {
          expect(instance.state).toEqual('fourth');
        });

        test('user defined fn calls transition', () => {
          instance.transition('init');
          instance.transitionToFourth();
          expect(instance.state).toEqual('fourth');
        });

        describe('instance.transition', () => {
          test('transition without argument', () => {
            instance.transition('first');
            expect(instance.state).toEqual('first');
            expect(mockOnEnterFirst).toHaveBeenCalledTimes(1);
            expect(mockOnEnterFirst).toHaveBeenCalledWith();
          });
          test('transition with 1 argument', () => {
            const param = { randomArgument: true };
            instance.transition('second', param);
            expect(instance.state).toEqual('second');
            expect(mockOnEnterSecond).toHaveBeenCalledTimes(1);
            expect(mockOnEnterSecond).toHaveBeenCalledWith(param);
          });
          test('transition with 2 argument', () => {
            const param0 = { randomArgument: true };
            const param1 = 234;
            instance.transition('third', param0, param1);
            expect(mockOnEnterThird).toHaveBeenCalledTimes(1);
            expect(mockOnEnterThird).toHaveBeenCalledWith(param0, param1);
          });
        });

        test('deferUntilTransition', () => {
          instance.transition('init');
          expect(instance.state).toEqual('init');
          expect(mockEventAFirst).not.toHaveBeenCalled();

          instance.handle('eventA');
          expect(instance.state).toEqual('init');
          expect(mockEventAFirst).not.toHaveBeenCalled();

          instance.transition('first');
          expect(mockEventAFirst).toHaveBeenCalledTimes(1);
        });

        test('deferAndTransition', () => {
          instance.transition('init');
          expect(instance.state).toEqual('init');
          expect(mockEventCFirst).not.toHaveBeenCalled();

          instance.handle('eventC');
          expect(mockEventCFirst).toHaveBeenCalledTimes(1);
          expect(instance.state).toEqual('first');
        });

        test('handlerFn is string', () => {
          instance.transition('init');
          expect(instance.state).toEqual('init');

          instance.handle('eventB');
          expect(instance.state).toEqual('first');
        });
      });
    });
  });
});
