// create a NDEF message with plain text

var ndef = require('../index'),
    message,
    byteArray,
    buffer;

message = [ ndef.textRecord('hello, world') ];
console.log(message);

byteArray = ndef.encodeMessage(message);
buffer = Buffer.from(byteArray);

console.log(buffer.toString('base64'));
