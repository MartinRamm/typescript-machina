import { describe, test } from '@jest/globals';
import { fsm } from '../../../src';

describe('defineState', () => {
  test('defineState without inferred types', () => {
    const builder = fsm.builder({
      states: {
        stateZero: fsm.state(),
        stateOne: fsm.state(),
        stateTwo: fsm.state<[boolean]>(),
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

    //this would typically be in a seperate file, in order to avoid one large file with all states
    const stateZero = fsm.defineState<typeof builder, 'stateZero'>({
      handlerA: fsm.handlerFn(function () {
        //@ts-expect-error
        this.handle('does-not-exist');
      }),
    });
  });

  //TODO add much more tests
});
