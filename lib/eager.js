/**
 * Created by fritz on 3/5/14.
 */

var _ = require('underscore');
var async = require('async');
var slice = [].slice;

// arguments accepted like _.extend api
module.exports = function eager() {

  // detect if callback exists
  var cb = null;
  var args = _.toArray(arguments);
  var lastArg = _.last(args);
  if (_.isFunction(lastArg)) {
    cb = lastArg;
    args = _.initial(args);
  }

  var scopes = slice.call(args);
  var map = _.extend.apply(_, scopes);

  function hit(scope, key, cb) {
    var cbCalled = false;
    var val = scope[key];
    var err = null;

    if (_.isFunction(val)) {
      // if `val` is a function
      if (val.length >= 2) {
        // if `val` accepts a callback
        val.call(scope, scope, function (err, result) {
          if (!err) {
            scope[key] = result;
          }
          cb(err);
        });
        cbCalled = true;
      } else {
        try {
          scope[key] = val.call(scope, scope);
        } catch (_err) {
          err = _err;
        }
      }
    }

    if (!cbCalled) {
      cb(err);
    }
  }

  async.eachSeries(_.keys(map), function (key, next) {
    hit(map, key, next);
  }, function (err) {
    if (cb) {
      cb(err, map);
    }
  });

  return map;

};
