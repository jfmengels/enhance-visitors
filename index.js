'use strict';

var _ = require('lodash/fp');

var merge = _.mergeWith(function _merge(prev, next, key) {
  if (!prev) {
    return next;
  }
  return function (node) {
    if (/:exit$/.test(key)) {
      next(node);
      prev(node);
    } else {
      prev(node);
      next(node);
    }
  };
});

var mergeVisitors = _.reduce(merge, {});

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
