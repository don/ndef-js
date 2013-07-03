// dump a tag to a file
// parse the ndef message from the tag
// print the contents

var spawn = require('child_process').spawn,
    ndef = require('../lib/ndef'),
    fs = require('fs'),
    mifareClassic = require('../lib/mifare-classic'),
    fileName = 'foo.mfd';
        
function printNdefInfo() {
    buffer = fs.readFileSync(fileName);
    ndefBuffer = mifareClassic.getNdefData(buffer);
    console.log(ndefBuffer);

    message = ndef.decodeMessage(ndefBuffer.toJSON());
    console.log(message);

    // Print out the payload for each record
    message.forEach(function(record) {

        // TODO record.isType(ndef.TNF_WELL_KNOWN, ndef.RTD_TEXT)      
        if (record.tnf === ndef.TNF_WELL_KNOWN && record.type[0] === ndef.RTD_TEXT[0]) {
            
            console.log(ndef.text.decodePayload(record.payload));

        } else if (record.tnf === ndef.TNF_WELL_KNOWN && record.type[0] === ndef.RTD_URI[0]) {

            console.log(ndef.uri.decodePayload(record.payload));

        } else {
            console.log("No lo entiendo.");
        }

    });
}
    
var processOutput = "";    
    
dumpMifareClassic = spawn('nfc-mfclassic', [ 'r', 'b', fileName])

dumpMifareClassic.stdout.on('data', function (data) {
    // errors go to stdout, save data in case we need to display later
    processOutput += data;
});

dumpMifareClassic.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

dumpMifareClassic.on('close', function (code) {
    if (code === 0) {
        printNdefInfo();
        fs.unlinkSync(fileName);
    } else {
        // there was an error
        console.log(processOutput);
    }
});