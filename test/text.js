var assert = require("assert"),
    textHelper = require("../lib/ndef-text");

describe('NDEF Text Encoder', function() {

    it('should encode text with default lang', function() {
        
        var encoded = textHelper.encodePayload("hello, world");
        assert.equal(2, encoded[0]);
        assert.equal(101, encoded[1]); // e
        assert.equal(110, encoded[2]); // n        
        assert.equal(15, encoded.length);
        
    })
    
    it('should use supplied language', function() {
        
        var encoded = textHelper.encodePayload("hello, world", "en");
        assert.equal(2, encoded[0]);
        assert.equal(101, encoded[1]); // e
        assert.equal(110, encoded[2]); // n        
        assert.equal(15, encoded.length);

        encoded = textHelper.encodePayload("hello, world", "en-US");
        assert.equal(5, encoded[0]);
        assert.equal(101, encoded[1]); // e
        assert.equal(110, encoded[2]); // n        
        assert.equal(18, encoded.length);

        encoded = textHelper.encodePayload("Bonjour", "fr-CA");
        assert.equal(5, encoded[0]);
        assert.equal(102, encoded[1]); // f
        assert.equal(114, encoded[2]); // r        
        assert.equal(13, encoded.length);

    })

    it('should encode language code length as a byte', function() {
        
        var encoded = textHelper.encodePayload("hello, world", "abcdefghijklmnopqrstuvwxyz");
        assert.equal(26, encoded[0]);
        assert.equal(97, encoded[1]); // a
        assert.equal(98, encoded[2]); // b
        assert.equal(99, encoded[3]); // c        
        assert.equal(39, encoded.length);
                
    })
    
    // TODO UTF-16
       
})

describe('NDEF Text Decoder', function() {
    
    it('should decode Text', function() {
        var encoded = [2, 101, 110, 104, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100];
            decoded = textHelper.decodePayload(encoded);
        assert.equal("hello, world", decoded);
    })

    it('should handle UTF-16 bit in status byte', function() {
        // this test is sort of bogus because text is not UTF-16
        var encoded = [130, 101, 110, 104, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100];
            decoded = textHelper.decodePayload(encoded);
        assert.equal("hello, world", decoded);    
    })
            
})