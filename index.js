'use strict';

var rest = require('lodash.rest');
var assign = require('lodash.assign');

function mergeHandlers(prevHandler, newHandler) {
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

  return assign({}, newHandler, prevHandler);
}

var mergeVisitors = rest(function mergeVisitors(handlers) {
  return handlers.reduce(mergeHandlers);
});

module.exports = {
  mergeVisitors: mergeVisitors
};
