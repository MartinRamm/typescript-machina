import { describe, test } from '@jest/globals';
import { fsm } from '../../../src';

describe('builder', () => {
  describe('initialState', () => {
    const states = {
      init: fsm.state(),
      first: fsm.state<[number]>(),
      second: fsm.state<[string] | [string, number]>(),
    };

    test('must be defined state: init', () => {
      fsm.builder({
        states,
        initialState: 'init',
        handlers: {},
      });
    });
    test('must be defined state: first', () => {
      fsm.builder({
        states,
        initialState: 'first',
        handlers: {},
      });
    });
    test('must be defined state: second', () => {
      fsm.builder({
        states,
        initialState: 'second',
        handlers: {},
      });
    });

    test('tsc must fail on non-defined state', () => {
      fsm.builder({
        states,
        // @ts-expect-error
        initialState: 'not-defined',
        handlers: {},
      });
    });
    test('tsc must fail without initialState param', () => {
      // @ts-expect-error
      fsm.builder({
        states,
        handlers: {},
      });
    });
  });
});
