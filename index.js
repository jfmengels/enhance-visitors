'use strict';

var _ = require('lodash/fp');

function merge(prevHandler, newHandler) {
  Object.keys(prevHandler)
    .filter(function takeConflictingVisitors(key) {
      return newHandler[key];
    })
    .forEach(function mergeVisitors(key) {
      var previousVisitor = prevHandler[key];
      prevHandler[key] = function (node) {
        if (/:exit$/.test(key)) {
          newHandler[key](node);
          previousVisitor(node);
        } else {
          previousVisitor(node);
          newHandler[key](node);
        }
      };
    });

  return _.assign(newHandler, prevHandler);
}

var mergeVisitors = _.rest(function _mergeVisitors(handlers) {
  return handlers.reduce(merge, {});
});

var visitIf = _.rest(function _visitIf(predicates) {
  return function (visitor) {
    return function (node) {
      var isValid = predicates.every(function (fn) {
        return fn(node);
      });
      if (isValid) {
        return visitor(node);
      }
    };
  };
});

module.exports = {
  mergeVisitors: mergeVisitors,
  visitIf: visitIf
};
