'use strict';

var p4 = require('../');
var should = require('should');
var assert = require('assert');
var path = require('path');
var fs = require('fs');
require('mocha');

var p4FixturesPath = function (p4Path, glob) {
  return path.join(p4Path, glob);
};
var testFixturesPath = function (glob) {
  return path.join(__dirname, 'fixtures', glob);
};

describe('node-perforce draft test', function () {
  var changelist = 0;
  var clientRoot;
  this.beforeAll('client root path setup', function (done) {
    p4.info(function (err, info) {
      assert.ifError(err);
      var keys = Object.keys(info);
      assert.notEqual(keys.indexOf('userName'), -1);
      clientRoot = info.clientRoot;
      done();
    });
  });
});