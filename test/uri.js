var assert = require("assert"),
    uriHelper = require("../lib/ndef-uri"),
    util = require("../lib/ndef-util");

describe('NDEF URI Encoder', function() {

    it('should encode URIs', function() {
        
        var encoded = uriHelper.encodePayload("http://arduino.cc");
        assert.equal(3, encoded[0]); // prefix
        assert.equal(11, encoded.length);
        
    })
    
    it('should use first match', function() {
        
        // should substitute http://www. not http://        
        var encoded = uriHelper.encodePayload("http://www.arduino.cc");
        assert.equal(1, encoded[0]); // prefix
        assert.equal(11, encoded.length);

        // should substitute https://www. not https://        
        encoded = uriHelper.encodePayload("https://www.arduino.cc");
        assert.equal(2, encoded[0]); // prefix
        assert.equal(11, encoded.length);

    })

    it('should encode unknown prefixes', function() {
        
        var encoded = uriHelper.encodePayload("foo://bar");
        assert.equal(0, encoded[0]); // prefix
        assert.equal(10, encoded.length);
        
    })

    it('should encode bogus data', function() {
        
        var encoded = uriHelper.encodePayload("qwerty");
        assert.equal(0, encoded[0]); // prefix
        assert.equal(7, encoded.length);
        
    })

    it('should encode strange protocols', function() {
        
        var encoded = uriHelper.encodePayload("urn:epc:raw:somedata");        
        assert.equal(33, encoded[0]); // prefix
        assert.equal(9, encoded.length);
        
    })
       
})

function getBytes(prefix, string) {
    var bytes = util.stringToBytes(string);
    bytes.unshift(prefix);
    return bytes;
}

describe('NDEF URI Decoder', function() {
    
    it('should decode URIs', function() {

        var bytes = getBytes(0, "http://arduino.cc");
        var decoded = uriHelper.decodePayload(bytes);        
        assert.equal("http://arduino.cc", decoded);

        bytes = getBytes(1, "arduino.cc");
        decoded = uriHelper.decodePayload(bytes);        
        assert.equal("http://www.arduino.cc", decoded);
        
        bytes = getBytes(2, "arduino.cc");
        decoded = uriHelper.decodePayload(bytes);        
        assert.equal("https://www.arduino.cc", decoded);
        
        bytes = getBytes(3, "arduino.cc");                
        decoded = uriHelper.decodePayload(bytes);                
        assert.equal("http://arduino.cc", decoded);
        
        bytes = getBytes(4, "arduino.cc");
        decoded = uriHelper.decodePayload(bytes);
        assert.equal("https://arduino.cc", decoded);        
        
    })

    // not sure if this is a good idea
    it('should decode strings', function() {

        var decoded = uriHelper.decodePayload("0http://arduino.cc");        
        assert.equal("http://arduino.cc", decoded);

        decoded = uriHelper.decodePayload("3arduino.cc");        
        assert.equal("http://arduino.cc", decoded);
                
    })
    
    it('should handle invalid prefixes', function() {
        
        var bytes = getBytes(36, "foo");                
        var decoded = uriHelper.decodePayload(bytes);                
        assert.equal("foo", decoded);

        bytes = getBytes(0xFF, "foo");                
        decoded = uriHelper.decodePayload(bytes);                
        assert.equal("foo", decoded);  

        bytes = getBytes(-1, "foo");                
        decoded = uriHelper.decodePayload(bytes);                
        assert.equal("foo", decoded);  

        bytes = getBytes(-255, "foo");                
        decoded = uriHelper.decodePayload(bytes);                
        assert.equal("foo", decoded);  
      
    })
            
})