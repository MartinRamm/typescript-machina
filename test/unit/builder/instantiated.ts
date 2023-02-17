import { describe, expect, test } from '@jest/globals';
import { expectTypeOf } from 'expect-type';
import { fsm } from '../../../src';

describe('builder', () => {
  test('result of builder can be instantiated', () => {
    const builder = fsm.builder({
      states: {
        state1: fsm.state(),
      },
      initialState: 'state1',
      handlers: {
        handler1: fsm.handler(),
      },
    });
    const stateMachine = builder.build({
      state1: fsm.defineState({}),
    });
    expectTypeOf(stateMachine).constructorParameters.toEqualTypeOf<[]>();
    const instance = new stateMachine();
    expect(instance).toHaveProperty('state');
  });
});
