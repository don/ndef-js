// Copyright 2013 Don Coleman

// Decode an NDEF message from a file created with libnfc's MIFARE Classic command line tool nfc-mfclassic

var fs = require('fs'),
    mifareClassic = require('../lib/mifare-classic'),
    ndef = require('../lib/ndef'),
    fileName = process.argv[2],
    buffer;

if (!fileName) {
    console.log("Specify a filename to parse\n     e.g. node decode.js data/hello.mfd");
    process.exit(1);
}

// this belongs in ndef-utils or ndef
function decodeUriPrefix(prefixCode) {
    
    switch(prefixCode) {
        case 0x0:
            prefix = "";
            break;            
        case 0x1:
            prefix = "http://www.";
            break;
        case 0x2:
            prefix = "https://www.";
            break;            
        case 0x3:
            prefix = "http://";
            break;
        case 0x4:
            prefix = "https://";
            break;            
        default:
            // TODO implement all code (use a map)
            prefix = "?????";
    } 
    
    return prefix;           
}

buffer = fs.readFileSync(fileName);
ndefBuffer = mifareClassic.getNdefData(buffer);
console.log(ndefBuffer);

message = ndef.decodeMessage(ndefBuffer.toJSON());
console.log(message);

// Print out the payload for each record
message.forEach(function(record) {
    
    var payload, languageCodeLength, utf16, prefix;

    // TODO record.isType(ndef.TNF_WELL_KNOWN, ndef.RTD_TEXT)      
    if (record.tnf === ndef.TNF_WELL_KNOWN && record.type[0] === ndef.RTD_TEXT[0]) {
        
        payload = new Buffer(record.payload);

        languageCodeLength = (payload[0] & 0x1F); // 5 bits
        utf16 = (payload[0] & 0x80) !== 0; // assuming UTF-16BE
            
        console.log("lang " + payload.slice(1, 1 + languageCodeLength) + (utf16 ? " utf16" : " utf8"));        
        console.log(payload.slice(languageCodeLength + 1).toString('utf8'));
        
    } else if (record.tnf === ndef.TNF_WELL_KNOWN && record.type[0] === ndef.RTD_URI[0]) {

        payload = new Buffer(record.payload);
        prefix = decodeUriPrefix(payload[0]);
        console.log(prefix + payload.slice(1));
        
    } else {
        console.log("No lo entiendo.");
    }

});
