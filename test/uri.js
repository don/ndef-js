var assert = require("assert");
var ndef = require("../lib/ndef-uri"); // TODO

describe('NDEF URI Encoder', function() {

    it('should encode URIs', function() {
        
        var encoded = ndef.encodeURI("http://arduino.cc");
        assert.equal(3, encoded[0]); // prefix
        assert.equal(11, encoded.length);
        
    })
    
    it('should use first match', function() {
        
        // should substitute http://www. not http://        
        var encoded = ndef.encodeURI("http://www.arduino.cc");
        assert.equal(1, encoded[0]); // prefix
        assert.equal(11, encoded.length);

        // should substitute https://www. not https://        
        encoded = ndef.encodeURI("https://www.arduino.cc");
        assert.equal(2, encoded[0]); // prefix
        assert.equal(11, encoded.length);

    })

    it('should encode unknown prefixes', function() {
        
        var encoded = ndef.encodeURI("foo://bar");
        assert.equal(0, encoded[0]); // prefix
        assert.equal(10, encoded.length);
        
    })

    it('should encode bogus data', function() {
        
        var encoded = ndef.encodeURI("qwerty");
        assert.equal(0, encoded[0]); // prefix
        assert.equal(7, encoded.length);
        
    })

    it('should encode strange protocols', function() {
        
        var encoded = ndef.encodeURI("urn:epc:raw:somedata");        
        assert.equal(33, encoded[0]); // prefix
        assert.equal(9, encoded.length);
        
    })
       
})

function getBytes(prefix, string) {
    var bytes = Buffer(string).toJSON();
    bytes.unshift(prefix);
    return bytes;
}

describe('NDEF URI Decoder', function() {
    
    it('should decode URIs', function() {

        var bytes = getBytes(0, "http://arduino.cc");
        var decoded = ndef.decodeURI(bytes);        
        assert.equal("http://arduino.cc", decoded);

        bytes = getBytes(1, "arduino.cc");
        decoded = ndef.decodeURI(bytes);        
        assert.equal("http://www.arduino.cc", decoded);
        
        bytes = getBytes(2, "arduino.cc");
        decoded = ndef.decodeURI(bytes);        
        assert.equal("https://www.arduino.cc", decoded);
        
        bytes = getBytes(3, "arduino.cc");                
        decoded = ndef.decodeURI(bytes);                
        assert.equal("http://arduino.cc", decoded);
        
        bytes = getBytes(4, "arduino.cc");
        decoded = ndef.decodeURI(bytes);
        assert.equal("https://arduino.cc", decoded);        
        
    })

    // not sure if this is a good idea
    it('should decode strings', function() {

        var decoded = ndef.decodeURI("0http://arduino.cc");        
        assert.equal("http://arduino.cc", decoded);

        decoded = ndef.decodeURI("3arduino.cc");        
        assert.equal("http://arduino.cc", decoded);
                
    })
    
    it('should handle invalid prefixes', function() {
        
        var bytes = getBytes(36, "foo");                
        var decoded = ndef.decodeURI(bytes);                
        assert.equal("foo", decoded);

        bytes = getBytes(0xFF, "foo");                
        decoded = ndef.decodeURI(bytes);                
        assert.equal("foo", decoded);  

        bytes = getBytes(-1, "foo");                
        decoded = ndef.decodeURI(bytes);                
        assert.equal("foo", decoded);  

        bytes = getBytes(-255, "foo");                
        decoded = ndef.decodeURI(bytes);                
        assert.equal("foo", decoded);  
      
    })
            
})