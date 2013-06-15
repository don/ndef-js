Library to create and parse NDEF messages.

    ndef = require('ndef');
    
    var message = [
        ndef.textRecord("hello, world")
    ];
    
    var buffer = new Buffer(ndef.encodeMessage(message));
    
See the [examples](examples) directory for more information on creating and decoding messages.

The decode.js example uses [mifare dump files](http://nfc-tools.org/index.php?title=Libnfc:nfc-mfclassic) created with lib-nfc.

On a mac, use [homebrew](http://mxcl.github.io/homebrew/) to install libnfc.

    $ brew install libnfc
    
Plugin a NFC reader like a [SLC3711](http://www.identive-group.com/products-and-solutions/identification-products/mobility-solutions/mobile-readers/scl3711-contactless-usb-smart-card-reader) into your computer.

Place a tag on the reader and issue this command to write the tag to a file.

    $ nfc-mfclassic r b dump.mfd

See the [phonegap-nfc documentation](https://github.com/chariotsolutions/phonegap-nfc#ndef) for additional info.
