### NOTE: See [ndef-mifare-classic-js](https://github.com/don/ndef-mifare-classic-js/tree/master/examples) for better examples.

## Creating Messages
There are 3 examples that show how to create `NdefMessages`: [text.js](text.js), [uri.js](uri.js) and [multipleRecords.js](multipleRecords.js).

## Reading Tags

The [readTag.js](readTag.js) example uses [nfc-mfclassic](http://nfc-tools.org/index.php?title=Libnfc:nfc-mfclassic) from [libnfc](http://nfc-tools.org/) to read tags and this ndef module to parse the messages.

Place a tag on the reader

    $ cd ndef-js/examples
    $ node readTag.js

    <Buffer d1 01 0f 54 02 65 6e 68 65 6c 6c 6f 2c 20 77 6f 72 6c 64>
    [ { tnf: 1,
        type: [ 84 ],
        id: [],
        payload: [ 2, 101, 110, 104, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100 ] } ]
    hello, world

## Decoding Messages

The [decode.js](decode.js) example reads tag info from mifare dump files created with [nfc-mfclassic](http://nfc-tools.org/index.php?title=Libnfc:nfc-mfclassic). Sample dump files are included in the [data](data/) directory, so you don't need to have libnfc installed or a nfc reader to run them.

## Installing libnfc

On a mac, use [homebrew](http://mxcl.github.io/homebrew/) to install libnfc.

    $ brew install libnfc
    
Other platforms? See [nfc-tools.org](http://nfc-tools.org/)

## Creating Dump Files
    
Plugin a NFC reader like a [SLC3711](http://www.identive-group.com/products-and-solutions/identification-products/mobility-solutions/mobile-readers/scl3711-contactless-usb-smart-card-reader) into your computer.

Place a tag on the reader and issue this command to write the tag to a file.

    $ nfc-mfclassic r b dump.mfd

## mifare-classic.js

Note that lib/mifare-classic.js is not exported by this module.  If you find it useful, file an [issue](https://github.com/don/ndef-js/issues) and I can create a new mifare npm module.
