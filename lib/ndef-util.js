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
    
    bytesToString: function (bytes) {
        var bytesAsString = "";
        for (var i = 0; i < bytes.length; i++) {
            bytesAsString += String.fromCharCode(bytes[i]);
        }
        return bytesAsString;
    },

    // http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string#1242596
    stringToBytes: function (str) {
        var ch, st, re = [];
        for (var i = 0; i < str.length; i++ ) {
            ch = str.charCodeAt(i);  // get char
            st = [];                 // set up "stack"
            do {
                st.push( ch & 0xFF );  // push byte to stack
                ch = ch >> 8;          // shift value down by 1 byte
            } while ( ch );
            // add stack contents to result
            // done because chars have "wrong" endianness
            re = re.concat( st.reverse() );
        }
        // return an array of bytes
        return re;
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