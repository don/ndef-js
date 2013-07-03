Library to create and parse NDEF messages.

    ndef = require('ndef');
    
    message = [
        ndef.textRecord("hello, world")
    ];

    bytes = ndef.encodeMessage(message);
    
    // do something useful with bytes: write to a tag or send to a peer
      
    records = ndef.decodeMessage(bytes);

    ndef.text.decodePayload(records[0].payload);

    // prints 'hello, world'
            
See the [examples](examples) directory for more information on creating and decoding messages.

See the [phonegap-nfc documentation](https://github.com/chariotsolutions/phonegap-nfc#ndef) for additional info.
