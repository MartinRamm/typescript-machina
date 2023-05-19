import { describe, expect, test } from '@jest/globals';
import { regexp } from '../../unit-setup/multi-file-regexp-example/regexp';

describe('multi-file-regexp-example', () => {
  const fsm = new regexp();

  const success = ['abc', 'aabc', 'aaabc', 'abbc', 'abbbc', 'aabbc', 'abcc', 'abccc', 'abbcc', 'aabcc'];
  success.forEach(input => success.push(`prefix${input}`));
  success.forEach(input => success.push(`${input}postfix`));

  success.forEach(input => {
    test(`must succeed: ${input}`, () => {
      const result = fsm.match(input);
      expect(result).toStrictEqual(true);
      expect(fsm.state).toStrictEqual('success');
    });
  });

  const fail = ['a', 'b', 'c', 'ac', 'bc', 'ab', 'aa', 'bb', 'cc', 'aabb', 'bbcc'];
  fail.forEach(input => fail.push(`prefix${input}`));
  fail.forEach(input => fail.push(`${input}postfix`));

  fail.forEach(input => {
    test(`must fail: ${input}`, () => {
      const result = fsm.match(input);
      expect(result).toStrictEqual(false);
      expect(fsm.state).toStrictEqual('fail');
    });
  });
});
