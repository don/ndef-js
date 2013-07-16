var assert = require("assert");
var ndef = require("../lib/ndef");

var textMessageHelloWorld = [ 209, 1, 15, 84, 2, 101, 110, 104, 101, 108, 108, 111,
            44, 32, 119, 111, 114, 108, 100 ];
var urlMessageNodeJSorg = [ 209, 1, 11, 85, 3, 110, 111, 100, 101, 106, 115, 46,
            111, 114, 103 ];
var mimeMediaMessage = [ 210, 9, 27, 116, 101, 120, 116, 47, 106, 115, 111, 110,
            123, 34, 109, 101, 115, 115, 97, 103, 101, 34, 58, 32, 34, 104, 101, 108,
            108, 111, 44, 32, 119, 111, 114, 108, 100, 34, 125 ];
var multipleRecordMessage = [ 145, 1, 15, 84, 2, 101, 110, 104, 101, 108, 108, 111,
            44, 32, 119, 111, 114, 108, 100, 17, 1, 11, 85, 3, 110, 111, 100, 101,
            106, 115, 46, 111, 114, 103, 82, 9, 27, 116, 101, 120, 116, 47, 106, 115,
            111, 110, 123, 34, 109, 101, 115, 115, 97, 103, 101, 34, 58, 32, 34, 104,
            101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 34, 125 ];            
var emptyMessage = [ 208, 0, 0 ];
var threeEmptyMessage =[ 144, 0, 0, 16, 0, 0, 80, 0, 0 ];

describe('Encode Message', function() {
    describe('textRecord', function() {

        it('should match known message', function() {
            var message = [
                ndef.textRecord("hello, world")
            ];

            var encoded = ndef.encodeMessage(message);

            assert.deepEqual(textMessageHelloWorld, encoded);
        })
    })

    describe('uriRecord', function() {
        it('should match known message', function() {
            var message = [
                ndef.uriRecord("http://nodejs.org")
            ];

            var encoded = ndef.encodeMessage(message);

            assert.deepEqual(urlMessageNodeJSorg, encoded);
        })
    })

    describe('mimeMediaRecord', function() {
        it('should match known message', function() {
            var message = [
                ndef.mimeMediaRecord("text/json", '{"message": "hello, world"}')
            ];
            
            var encoded = ndef.encodeMessage(message);
            
            assert.deepEqual(mimeMediaMessage, encoded);
        })
    })
    
    describe('emptyRecord', function() {
        it('should match known message', function() {
            var message = [
                ndef.emptyRecord()
            ];
            
            var encoded = ndef.encodeMessage(message);
            
            assert.deepEqual(emptyMessage, encoded);
        })
    })

    describe('multipleEmptyRecords', function() {
        it('should match known message', function() {
            var message = [
                ndef.emptyRecord(),
                ndef.emptyRecord(),
                ndef.emptyRecord()                
            ];
            
            var encoded = ndef.encodeMessage(message);
            
            assert.deepEqual(threeEmptyMessage, encoded);
        })
    })

    describe('multipleRecords', function() {
        it('should match known message', function() {
            var message = [
                ndef.textRecord("hello, world"),
                ndef.uriRecord("http://nodejs.org"),
                ndef.mimeMediaRecord("text/json", '{"message": "hello, world"}')
            ];
            
            var encoded = ndef.encodeMessage(message);
            
            assert.deepEqual(multipleRecordMessage, encoded);
        })
    })
    
})

describe('Decode Message', function() {
    describe('textRecord', function() {

        it('should match known record', function() {
            
            var decodedMessage = ndef.decodeMessage(textMessageHelloWorld);            
            assert.equal(1, decodedMessage.length);
            
            var record = ndef.textRecord("hello, world");
            var decodedRecord = decodedMessage[0];
            
            assert.equal(record.tnf, decodedRecord.tnf);            
            assert.deepEqual(record.type, decodedRecord.type);
            assert.deepEqual(record.payload, decodedRecord.payload);
        })
    })
})

describe('decodeMessage', function() {

    it('should not be destructive', function() {
        
        var decodedMessage = ndef.decodeMessage(textMessageHelloWorld);            
        assert.equal(1, decodedMessage.length);
        
        decodedMessage = ndef.decodeMessage(textMessageHelloWorld);            
        assert.equal(1, decodedMessage.length);
    })
    
    it('should decode multiple records', function() {
        
        var decodedMessage = ndef.decodeMessage(multipleRecordMessage);            
        assert.equal(3, decodedMessage.length);
        
        assert.equal(ndef.TNF_WELL_KNOWN, decodedMessage[0].tnf);
        assert.deepEqual(ndef.RTD_TEXT, decodedMessage[0].type);
        assert.equal("hello, world", new Buffer(decodedMessage[0].payload).slice(3));
        
        assert.equal(ndef.TNF_WELL_KNOWN, decodedMessage[1].tnf);
        assert.deepEqual(ndef.RTD_URI, decodedMessage[1].type);
        assert.equal("nodejs.org", new Buffer(decodedMessage[1].payload).slice(1)); // char 0 is 0x3 for http://
                
        assert.equal(ndef.TNF_MIME_MEDIA, decodedMessage[2].tnf);
        assert.equal("text/json", new Buffer(decodedMessage[2].type));
        assert.equal('{"message": "hello, world"}', new Buffer(decodedMessage[2].payload));             
    })
    
})

describe('stringify', function() {
    
    it ('should stringify messages', function() {
        var message = [
            ndef.textRecord("hello, world")
        ];

        var string = ndef.stringify(message);

        assert.equal("Text Record\nhello, world\n", string);

        message = [
            ndef.uriRecord("http://www.example.com"),
            ndef.textRecord("hello, world")
        ];

        string = ndef.stringify(message);

        assert.equal("URI Record\nhttp://www.example.com\n\nText Record\nhello, world\n", string);
    })

    it ('should stringify smartposters', function() {
        var message = [
            ndef.smartPoster(
                [
                    ndef.uriRecord("http://www.example.com"),
                    ndef.textRecord("hello, world")
                ]
            )
        ];

        var string = ndef.stringify(message);

        // ideally the inner message would be indented
        assert.equal("Smart Poster\nURI Record\nhttp://www.example.com\n\nText Record\nhello, world\n\n", string);
    })

    it ('should stringify records', function() {
        var record = ndef.textRecord("hello, world");
        var string = ndef.stringify(record);

        assert.equal("Text Record\nhello, world\n", string);
    })

    it ('should reject invalid records', function() {

        var record = ndef.record(17, [], [], []);
        var string = ndef.stringify(record);

        assert.equal("Can't process TNF 17\n", string);
    })

    it ('only handles some well known types', function() {

        var record = ndef.record(ndef.TNF_WELL_KNOWN, ndef.RTD_HANDOVER_REQUEST, 
            [0x48, 0x72], [0x12,0x91,0x02,0x02,0x63,0x72,0xAA,0x0D,0x51,0x02,0x04,0x61,0x63,0x01,0x01,0x62,0x00]);
        var string = ndef.stringify(record);

        assert.equal(0, string.indexOf("Hr Record"));
    })

    it ('should do something sensible with message bytes', function() {
        var message = [
            ndef.textRecord("hello, world")
        ];

        var bytes = ndef.encodeMessage(message);

        var string = ndef.stringify(bytes);

        assert.equal("Text Record\nhello, world\n", string);
    })

    it ('should handle empty array', function() {
        var string = ndef.stringify([]);
        assert.equal("", string);
    })

})
