// ndef-util.js
// Copyright 2013 Don Coleman
// 

// This is from phonegap-nfc.js and is a combination of helpers in nfc and util
// https://github.com/chariotsolutions/phonegap-nfc/blob/master/www/phonegap-nfc.js

module.exports = {
    
    // i must be <= 256
    toHex: function (i) {
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
    },

    toPrintable: function(i) {

        if (i >= 0x20 & i <= 0x7F) {
            return String.fromCharCode(i);
        } else {
            return '.';
        }
    },
    
    stringToBytes: function (string) {
        return Buffer(string).toJSON();
    },

    bytesToString: function (bytes) {
        return Buffer(bytes).toString();
    },
    
    bytesToHexString: function (bytes) {
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
};