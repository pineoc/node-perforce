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

describe('node-perforce', function () {
  var changelist = 0;
  var clientRoot;
  describe('info', function () {
    it('Should output p4 info', function (done) {
      p4.info(function (err, info) {
        assert.ifError(err);
        var keys = Object.keys(info);
        assert.notEqual(keys.indexOf('userName'), -1);
        clientRoot = info.clientRoot;
        done();
      });
    });
  });

  describe('changelist', function () {
    this.beforeAll('fixture file copy', function (done) {
      fs.copyFileSync(testFixturesPath('one.js'), p4FixturesPath(clientRoot, 'one.js'));
      fs.copyFileSync(testFixturesPath('two.json'), p4FixturesPath(clientRoot, 'two.json'));
      done();
    });

    it('Should create a changelist', function (done) {
      p4.changelist.create({description: 'hello'}, function (err, cl) {
        assert.ifError(err);
        changelist = cl;
        done();
      });
    });
    it('Should be named \'hello\'', function (done) {
      p4.changelist.view({changelist: changelist}, function (err, view) {
        assert.ifError(err);
        assert.equal('hello', view.description);
        done();
      });
    });
    it('Should modify description of changelist as \'world\'', function (done) {
      p4.changelist.edit({changelist: changelist, description: 'world'}, function (err) {
        assert.ifError(err);
        p4.changelist.view({changelist: changelist}, function (err, view) {
          assert.ifError(err);
          assert.equal(view.description, 'world');
          done();
        });
      });
    });
    describe('add and revert', function () {
      it('Should add files', function (done) {
        var files = [p4FixturesPath(clientRoot, 'one.js'), p4FixturesPath(clientRoot, 'two.json')]
        p4.add({changelist:changelist, files: files}, function (err) {
          assert.ifError(err);
          p4.changelist.view({changelist: changelist}, function (err, view) {
            if (err) return done(err);
            assert.equal(view.files.length, 2);
            done();
          });
        });
      });
      it('Should revert files', function (done) {
        var files = [p4FixturesPath(clientRoot, 'one.js'), p4FixturesPath(clientRoot, 'two.json')]
        p4.revert({changelist: changelist, files: files}, function (err) {
          assert.ifError(err);
          p4.changelist.view({changelist: changelist}, function (err, view) {
            if (err) return done(err);
            assert.equal(view.files.length, 0);
            done();
          });
        });
      });
    });
  });

  describe('cleanup', function () {
    it('Should delete changelist', function (done) {
      p4.changelist.delete({changelist: changelist}, function (err) {
        assert.ifError(err);
        p4.changelist.view({changelist: changelist}, function (err) {
          // view if error, delete success
          assert.ok(err.toString().indexOf(`Change ${changelist} unknown`) !== -1);
          done();
        });
      });
    });
  });

  describe('sync', function () {
    it('Should sync file', function (done) {
      p4.sync({files: [p4FixturesPath(clientRoot, '...')]}, function (err) {
        assert.ok(err.toString().indexOf('up-to-date') !== -1);
        done();
      });
    });
  });

  describe('where', function () {
    it('Should where file', function (done) {
      p4.where({files: [p4FixturesPath(clientRoot, 'one.js')]}, function (err) {
        assert.ifError(err);
        done();
      });
    });
  });

  describe('changes', function () {
    it('Should changes list exist', function (done) {
      p4.changes({max: 1}, function (err, result) {
        assert.ifError(err);
        assert.ok(result.length > 0);
        done();
      });
    });
    it('Should be able to get multiple changes list', function (done) {
      p4.changes({max: 3}, function (err, result) {
        assert.ifError(err);
        assert.ok(result.length <= 3);
        assert.ok(result[0].change);
        done();
      })
    });
  });

  describe('describe', function () {
    it('Should describe of changelist exist', function(done) {
      p4.describe({changelist: 1}, function (err, result) {
        assert.ifError(err);
        assert.ok(result);
        done();
      });
    });
  });
});