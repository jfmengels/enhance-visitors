/* eslint-disable ava/test-title */
import test from 'ava';
import {mergeVisitors} from './';

function fixtures() {
  const visitor1 = {
    Identifier: () => {},
    Literal: () => {}
  };
  const visitor2 = {
    Identifier: () => {},
    VariableDeclaration: () => {}
  };
  const visitor3 = {
    Identifier: () => {},
    ExpressionStatement: () => {}
  };
  return {
    visitor1,
    visitor2,
    visitor3
  };
}

test('should return visitor object if it is single', t => {
  const {visitor1} = fixtures();

  t.true(mergeVisitors(visitor1) === visitor1);
});

test('should merge visitor objects and return a new visitor object', t => {
  const {visitor1, visitor2} = fixtures();

  const visitor = mergeVisitors(visitor1, visitor2);

  t.true(typeof visitor === 'object');
  t.true(Object.keys(visitor).length === 3);
  t.truthy(visitor.Identifier);
  t.truthy(visitor.Literal);
  t.truthy(visitor.VariableDeclaration);
});

test('should merge multiple visitor objects and return a new visitor object', t => {
  const {visitor1, visitor2, visitor3} = fixtures();

  const visitor = mergeVisitors(visitor1, visitor2, visitor3);

  t.true(typeof visitor === 'object');
  t.true(Object.keys(visitor).length === 4);
  t.truthy(visitor.Identifier);
  t.truthy(visitor.Literal);
  t.truthy(visitor.VariableDeclaration);
  t.truthy(visitor.ExpressionStatement);
});

function sameArgumentToEveryVisitor(t, type, nbCalls) {
  t.plan(nbCalls);
  const value = {some: 'value'};
  const fn = (arg) => t.true(arg === value);
  const visitor1 = {
    Identifier: fn,
    Literal: fn
  };
  const visitor2 = {
    Identifier: fn,
    VariableDeclaration: fn
  };
  const visitor3 = {
    Identifier: fn,
    Literal: fn,
    ExpressionStatement: fn
  };
  const visitor = mergeVisitors(visitor1, visitor2, visitor3);

  if (visitor[type]) {
    visitor[type](value);
  }
}

sameArgumentToEveryVisitor.title = (t, type, nbCalls) =>
  `should call the same argument to every visitor function (${type} - ${nbCalls} times)`;

test(sameArgumentToEveryVisitor, 'Identifier', 3);
test(sameArgumentToEveryVisitor, 'Literal', 2);
test(sameArgumentToEveryVisitor, 'VariableDeclaration', 1);
test(sameArgumentToEveryVisitor, 'ExpressionStatement', 1);
test(sameArgumentToEveryVisitor, 'ImportDeclaration', 0);

function callInOrder(t, type, expectedOrder) {
  let order = [];
  const fn = (n) => () => order.push(n);
  const visitor1 = {
    'Identifier': fn(1),
    'Identifier:exit': fn(1),
    'Literal': fn(1),
    'Literal:exit': fn(1)
  };
  const visitor2 = {
    'Identifier': fn(2),
    'Identifier:exit': fn(2),
    'VariableDeclaration': fn(2),
    'VariableDeclaration:exit': fn(2)
  };
  const visitor3 = {
    'Identifier': fn(3),
    'Identifier:exit': fn(3),
    'Literal': fn(3),
    'Literal:exit': fn(3),
    'ExpressionStatement': fn(3),
    'ExpressionStatement:exit': fn(3)
  };
  const visitor = mergeVisitors(visitor1, visitor2, visitor3);

  if (visitor[type]) {
    visitor[type]();
  }

  t.deepEqual(order, expectedOrder);
}

callInOrder.title = (t, type) =>
  `should call visitors in the expected order (${type})`;

test(callInOrder, 'Identifier', [1, 2, 3]);
test(callInOrder, 'Identifier:exit', [3, 2, 1]);
test(callInOrder, 'Literal', [1, 3]);
test(callInOrder, 'Literal:exit', [3, 1]);
test(callInOrder, 'VariableDeclaration', [2]);
test(callInOrder, 'VariableDeclaration:exit', [2]);
test(callInOrder, 'ExpressionStatement', [3]);
test(callInOrder, 'ExpressionStatement:exit', [3]);
test(callInOrder, 'ImportDeclaration', []);
test(callInOrder, 'ImportDeclaration:exit', []);
