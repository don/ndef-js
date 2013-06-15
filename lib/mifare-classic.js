// mifare_classic.js
// Copyright 2013 Don Coleman

// Utility to getting NDEF data from mifare classic tag.
// Tested using data dumped from tags using nfclib
//
//     $ nfc-mfclassic r b dump.mfd

// Mifare Classic Block Size
var BLOCK_SIZE = 16;

// NDEF TLV starts at the 4th block
var TLV_START = BLOCK_SIZE * 4;

// NDEF Type and Length are 4 bytes
var TL_LENGTH = 4; 

function getNdefLength(rawTagData) {

    var b = rawTagData.slice(TLV_START, TLV_START + TL_LENGTH),
        length = -1;

    // 2 ways to encode length
    // short - [0x0, 0x0, 0x3, length];
    // long  - [0x3, 0xFF, length, length];
            
    if (b[0] === 0 && b[1] === 0 && b[2] === 3) { // short message
        length = b[3];        
    } else if (b[0] === 3 && b[1] === 255) { // long message
        length = ((0xFF & b[2]) << 8) | (0xFF & b[3]);
    } else {
        console.log("ERROR: Can't determine message length");        
    }
    return length;
}

// The first 32 sectors contain 4 blocks and the last 8 sectors contain 16 blocks.
// The tailing block of each sector contains
function isTrailingBlock(blockNumber) {
    if (blockNumber < (32 * 4)) {
        return (((blockNumber + 1) % 4) === 0);
    } else {
        return (((blockNumber + 1) % 16) === 0);        
    }
}

function getNdefData(rawTagData) {

    var messageLength = getNdefLength(rawTagData),    
        buffer = new Buffer(rawTagData.length),  // could be messageLength + BLOCK_SIZE * 4
        sourceStart = 0,
        targetStart = 0,
        messageStart,
        messageEnd,
        i;

    for (i = 0; i < 256; i++) { 
               
        if (!isTrailingBlock(i)) {
            sourceStart = i * BLOCK_SIZE;   
            rawTagData.copy(buffer, targetStart, sourceStart, sourceStart + BLOCK_SIZE);
            targetStart += BLOCK_SIZE; 
        } 
        
        if (targetStart > (messageLength + TL_LENGTH + BLOCK_SIZE * 3)) {
            // we've read enough data
            break;
        }       
    }

    // message starts in sector 1, but we've removed trailing blocks, so it's now block 4 
    messageStart = (BLOCK_SIZE * 3) + TL_LENGTH;
    messageEnd = messageStart + messageLength;    

    // verify NDEF TLV end
    if (buffer[messageEnd] != '0xfe') {
        console.log("WARNING: End of message does not look correct. Expecting 0xFE but got " + buffer[messageEnd]);
    }
        
    return buffer.slice(messageStart, messageEnd);
}

module.exports = {
    getNdefData: getNdefData
};