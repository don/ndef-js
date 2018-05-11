// Copyright 2013 Don Coleman

// Decode an NDEF message from a file created with libnfc's MIFARE Classic command line tool nfc-mfclassic

var fs = require('fs'),
    mifareClassic = require('../lib/mifare-classic'),
    ndef = require('../index'),
    fileName = process.argv[2],
    buffer;

if (!fileName) {
    console.log("Specify a filename to parse\n     e.g. node decode.js data/hello.mfd");
    process.exit(1);
}

buffer = fs.readFileSync(fileName);
ndefBuffer = mifareClassic.getNdefData(buffer);
console.log(ndefBuffer);

message = ndef.decodeMessage(ndefBuffer);
console.log(message);

// Print out the payload for each record
message.forEach(function(record) {
    
    var payload, languageCodeLength, utf16, prefix;

    // TODO record.isType(ndef.TNF_WELL_KNOWN, ndef.RTD_TEXT)      
    if (record.tnf === ndef.TNF_WELL_KNOWN && record.type[0] === ndef.RTD_TEXT[0]) {
        
        console.log(ndef.text.decodePayload(record.payload));
        
    } else if (record.tnf === ndef.TNF_WELL_KNOWN && record.type[0] === ndef.RTD_URI[0]) {

        console.log(ndef.uri.decodePayload(record.payload));
        
    } else {
        console.log("No lo entiendo.");
    }

});
