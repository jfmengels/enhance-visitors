import _ from 'lodash/fp';
import test from 'ava';
import {visitIf} from './';

test('should call visitor function if all predicates return true', t => {
  t.plan(4);
  const pass = () => t.pass();
  const T = _.stubTrue;

  visitIf()(pass)({});
  visitIf(T)(pass)({});
  visitIf(T, T)(pass)({});
  visitIf(T, T, T)(pass)({});
});

test('should not call visitor function if any predicate returns false', t => {
  const fail = () => t.fail();
  const T = _.stubTrue;
  const F = _.stubFalse;

  visitIf(F)(fail)({});
  visitIf(T, F)(fail)({});
  visitIf(F, T)(fail)({});
  visitIf(T, T, F)(fail)({});
  visitIf(T, F, T)(fail)({});
  visitIf(T, F, F)(fail)({});
  visitIf(F, T, T)(fail)({});
  visitIf(F, T, F)(fail)({});
  visitIf(F, F, T)(fail)({});
  visitIf(F, F, F)(fail)({});
});

test('should not call more predicates than necessary', t => {
  const fail = () => t.fail();
  const T = _.stubTrue;
  const F = _.stubFalse;

  visitIf(F, fail)(fail)({});
  visitIf(T, F, fail)(fail)({});
  visitIf(F, fail)(fail)({});
  visitIf(T, T, F, fail)(fail)({});
  visitIf(T, F, fail)(fail)({});
});
