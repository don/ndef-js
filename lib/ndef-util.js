// ndef-util.js
// Copyright 2013 Don Coleman
//

// This is from phonegap-nfc.js and is a combination of helpers in nfc and util
// https://github.com/chariotsolutions/phonegap-nfc/blob/master/www/phonegap-nfc.js

function stringToBytes(string) {
    var bytes = Buffer(string).toJSON();
    if (bytes.hasOwnProperty('data')) {
        // Node 0.12.x
        return bytes.data;
    } else {
        // Node 0.10.x
        return bytes;
    }
}

function bytesToString(bytes) {
    return Buffer(bytes).toString();
}

// useful for readable version of Tag UID
function bytesToHexString(bytes) {
    var dec, hexstring, bytesAsHexString = "";
    for (var i = 0; i < bytes.length; i++) {
       if (bytes[i] >= 0) {
           dec = bytes[i];
       } else {
           dec = 256 + bytes[i];
       }
       hexstring = dec.toString(16);
       // zero padding
       if (hexstring.length == 1) {
           hexstring = "0" + hexstring;
       }
       bytesAsHexString += hexstring;
    }
    return bytesAsHexString;
}

// i must be <= 256
function toHex(i) {
    var hex;

    if (i < 0) {
        i += 256;
    }
    hex = i.toString(16);

    // zero padding
    if (hex.length == 1) {
        hex = "0" + hex;
    }
    return hex;
}

function toPrintable(i) {
    if (i >= 0x20 & i <= 0x7F) {
        return String.fromCharCode(i);
    } else {
        return '.';
    }
}

module.exports = {
    stringToBytes: stringToBytes,
    bytesToString: bytesToString,
    bytesToHexString: bytesToHexString,
    toHex: toHex,
    toPrintable: toPrintable
};
