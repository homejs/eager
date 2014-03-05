/**
 * Created by fritz on 3/5/14.
 */

var eager = require('..');
var assert = require('assert');
var _ = require('underscore');

describe('eager', function () {

  it('maps with non-callback functions', function () {

    var map = eager({

      boy: 'jayin',
      dog: function () {
        return 'dog_' + 123;
      },
      msg: function (s) {
        return s.boy + ' has ' + s.dog;
      }

    });

    var expectedMsg = 'jayin has dog_123';
    assert.equal(map.msg, expectedMsg);

  });

  it('maps with callback functions', function (testDone) {

    function loadProfile(cb) {
      _.delay(function () {
        cb(null, {
          name: 'fritx'
        });
      }, 200);
    }

    eager({

      profile: function (s, cb) {
        loadProfile(cb);
        // you can also `delete s.stuff`
        // while using callback
      },
      word: 'sh*t',
      msg: function (s) {
        return s.profile.name + ' says: ' + s.word;
      }

    }, function (err, map) {

      var expectedMsg = 'fritx says: sh*t';
      assert.equal(err, null);
      assert.equal(map.msg, expectedMsg);
      testDone();

    });

  });

});
