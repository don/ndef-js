// Copyright 2013 Don Coleman

// create a NDEF message with multiple records

var ndef = require('../lib/ndef'),
    message,
    byteArray,
    buffer;

message = [ 
    ndef.uriRecord("http://nodejs.org"),
    ndef.textRecord("hello, world")
];
console.log(message);

byteArray = ndef.encodeMessage(message);
buffer = new Buffer(byteArray);

console.log(buffer.toString('base64'));
