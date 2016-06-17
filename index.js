'use strict';

var assign = require('lodash.assign');

function mergeHandlers(prevHandler, newHandler) {
  Object.keys(prevHandler).forEach(function (key) {
    var predef = prevHandler[key];

    if (typeof newHandler[key] === 'function') {
      prevHandler[key] = function (node) {
        if (/:exit$/.test(key)) {
          newHandler[key](node);
          predef(node);
        } else {
          predef(node);
          newHandler[key](node);
        }
      };
    }
  });

  return assign({}, newHandler, prevHandler);
}

module.exports = function mergeVisitors(handlers) {
  if (Array.isArray(handlers)) {
    return handlers.reduce(mergeHandlers);
  }
  return handlers;
};
