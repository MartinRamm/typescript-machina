import { describe, jest, test, expect } from '@jest/globals';
import { fsm } from '../../../src';

describe('defaultHandler', () => {
  const builder = fsm.builder({
    states: {
      stateZero: fsm.state(),
      stateOne: fsm.state(),
      stateTwo: fsm.state(),
    },
    initialState: 'stateZero',
    handlers: {
      handlerA: fsm.handler(),
    },
  });

  (['stateZero', 'stateOne', 'stateTwo'] as const).forEach(state =>
    test(`works for all states: ${state}`, () => {
      const mockFn = jest.fn();
      const i = new (builder.addDefaultHandler('handlerA', mockFn).build({
        stateZero: fsm.defineState({}),
        stateOne: fsm.defineState({}),
        stateTwo: fsm.defineState({}),
      }))();

      i.transition(state);
      i.handle('handlerA');

      expect(mockFn).toHaveBeenCalledTimes(1);
    })
  );

  test('single state can override default: stateZero', () => {
    const mockFn = jest.fn();
    const i = new (builder.addDefaultHandler('handlerA', mockFn).build({
      stateZero: fsm.defineState({
        handlerA: fsm.handlerFn(() => {}),
      }),
      stateOne: fsm.defineState({}),
      stateTwo: fsm.defineState({}),
    }))();

    i.transition('stateZero');
    i.handle('handlerA');

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  test('single state can override default: stateOne', () => {
    const mockFn = jest.fn();
    const i = new (builder.addDefaultHandler('handlerA', mockFn).build({
      stateZero: fsm.defineState({}),
      stateOne: fsm.defineState({
        handlerA: fsm.handlerFn(() => {}),
      }),
      stateTwo: fsm.defineState({}),
    }))();

    i.transition('stateOne');
    i.handle('handlerA');

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  test('single state can override default: stateTwo', () => {
    const mockFn = jest.fn();
    const i = new (builder.addDefaultHandler('handlerA', mockFn).build({
      stateZero: fsm.defineState({}),
      stateOne: fsm.defineState({}),
      stateTwo: fsm.defineState({
        handlerA: fsm.handlerFn(() => {}),
      }),
    }))();

    i.transition('stateTwo');
    i.handle('handlerA');

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
