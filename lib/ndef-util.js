// ndef-util.js
// Copyright 2013 Don Coleman
// 

// This is from phonegap-nfc.js and is a combination of helpers in nfc and util
// https://github.com/chariotsolutions/phonegap-nfc/blob/master/www/phonegap-nfc.js

var ndef = require('./ndef');

function stringToBytes(string) {
    return Buffer(string).toJSON();
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

// @records - NDEF Message (array of NDEF Records) or one NDEF Record
// @separator - line separator, optional, defaults to \n
// @returns string with NDEF Message or Record
function stringify(records, separator) {
    if (Array.isArray(records)) {
        return printRecords(records, separator);
    } else {
        return printRecord(records, separator);        
    }
}

// @message - NDEF Message (array of NDEF Records)
// @separator - line separator, optional, defaults to \n
// @returns string with NDEF Message
function printRecords(message, separator) {
    
    if(!separator) { separator = "\n"; }
    result = "";
    
    // Print out the payload for each record
    message.forEach(function(record) {
        result += printRecord(record, separator);
        result += separator;
    });
    
    return result.slice(0, (-1 * separator.length));
}

// @record - NDEF Record
// @separator - line separator, optional, defaults to \n
// @returns string with NDEF Record
function printRecord(record, separator) {        
    
    if(!separator) { separator = "\n"; }
    
    switch(record.tnf) {
        case ndef.TNF_EMPTY:
            result += "Empty Record";
            result += separator;            
            break;
        case ndef.TNF_WELL_KNOWN:
            result += printWellKnown(record, separator);
            break;            
        case ndef.TNF_MIME_MEDIA:
            result += "MIME Media";
            result += separator;            
            result += s(record.type);
            result += separator;            
            result += s(record.payload); // might be binary 
            break;            
        case ndef.TNF_ABSOLUTE_URI:
            // URI is in the type field
            result += "Absolute URI";
            result += separator;            
            result += s(record.type);                        
            break;
        case ndef.TNF_EXTERNAL_TYPE:
            // AAR contains strings, other types could
            // contain binary data
            result += "External";
            result += separator;                        
            result += s(record.type);
            result += separator;            
            result += s(record.payload);          
            break;        
        default:
            result += s("Can't process TNF " + record.tnf);
    }
    
    result += separator;    
    return result;
}

// not exported
function printWellKnown(record, separator) {
    
    var result = "";
    
    if (record.tnf !== ndef.TNF_WELL_KNOWN) {
        return "ERROR expecting TNF Well Known";
    }
    
    // unfortunately record types are byte[]
    switch(s(record.type)) {
        case s(ndef.RTD_TEXT):
            result += "Text Record";
            result += separator;            
            result += (ndef.text.decodePayload(record.payload));
            break;
        case s(ndef.RTD_URI):
            result += "URI Record";
            result += separator;            
            result += (ndef.uri.decodePayload(record.payload));            
            break;
        case s(ndef.RTD_SMART_POSTER):
            result += "Smart Poster";
            result += separator;            
            // the payload of a smartposter is a NDEF message
            result += printRecords(ndef.decodeMessage(record.payload));
            break;
        default:
            result += ("Don't know how to process " + s(record.type));
    }
    
    return result;
}
   
// convert bytes to a String   
function s(bytes) {
    return new Buffer(bytes).toString();
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
    stringify: stringify,
    toHex: toHex,
    toPrintable: toPrintable
};   
