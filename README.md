node-perforce
=============

A simple node library for perforce

## Install

```sh
$ npm install node-perforce --save
```

## Example

```js
var p4 = require('node-perforce');

// show p4 infos
p4.info(function (err, info) {
  if (err) return console.log(err);
  console.log(info);
});

// create a new changelist
p4.changelist.create({description: 'hello world'}, function (err, changelist) {
  if (err) return console.log(err);
  console.log('changelist:', changelist);
});

// view changelist info
p4.changelist.view({changelist: changelist}, function (err, view) {
  if (err) return console.log(err);
  console.log(view);
});

// edit changelist 1234
p4.changelist.edit({changelist: 1234, description: 'hi world'}, function (err) {
  if (err) return console.log(err);
});

// delete changelist 1234
p4.changelist.delete({changelist: 1234}, function (err) {
  if (err) return console.log(err);
});

// add files into CL@1234
p4.add({changelist: 1234, filetype: 'binary', files: ['*.bin']}, function(err) {
  if (err) return console.log(err);
});

// revert files
p4.revert({files: ['*.bin']}, function(err) {
  if (err) return console.log(err);
});

// edit files
p4.edit({files: ['*.js']}, function(err) {
  if (err) return console.log(err);
});

// show changes
p4.changes({time: true, max: 10, long: true}, function (err, result) {
  if (err) return console.log(err);
  console.log(result);
});

// show changelist detail - describe
p4.describe({shortened: true, changelist: 1}, function (err, info) {
  if (err) return console.log(err);
  console.log(info);
});
```
