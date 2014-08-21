var assert = require("assert"),
    util = require("../lib/ndef-util");

describe('UTF-8', function() {

    it('should encode UTF-8', function() {

        var bytes=[ 0x54, 0x65, 0x73, 0x74, 0x73, 0xd7, 0x90, 0xc2, 0xa2];

        var encoded = util.stringToBytes("Testsא¢");
        assert.deepEqual(encoded, bytes);

    });

    it('should decode UTF-8', function() {

        var bytes=[ 0x54, 0x65, 0x73, 0x74, 0x73, 0xd7, 0x90, 0xc2, 0xa2];

        var decoded = util.bytesToString(bytes);
        assert.equal(decoded, "Testsא¢");

    });

    it('should encode and decode Russian', function() {

        // http://www.columbia.edu/~kermit/utf8.html
        var russian = "На берегу пустынных волн";
        var russianBytes = [ 0xD0, 0x9D, 0xD0, 0xB0, 0x20, 0xD0, 0xB1, 0xD0, 0xB5, 0xD1, 0x80, 0xD0, 0xB5,
            0xD0, 0xB3, 0xD1, 0x83, 0x20, 0xD0, 0xBF, 0xD1, 0x83, 0xD1, 0x81, 0xD1, 0x82, 0xD1, 0x8B, 0xD0,
            0xBD, 0xD0, 0xBD, 0xD1, 0x8B, 0xD1, 0x85, 0x20, 0xD0, 0xB2, 0xD0, 0xBE, 0xD0, 0xBB, 0xD0, 0xBD ];

        var encoded = util.stringToBytes(russian);
        assert.deepEqual(encoded, russianBytes);

        var decoded = util.bytesToString(russianBytes);
        assert.equal(decoded, russian);
    });

    it('should round trip encode and decode UTF-8', function() {

        // http://www.columbia.edu/~kermit/utf8.html
        var chinese = "我能吞下玻璃而不伤身体。";
        assert.equal(util.bytesToString(util.stringToBytes(chinese)), chinese);

        var korean = "나는 유리를 먹을 수 있어요. 그래도 아프지 않아요";
        assert.equal(util.bytesToString(util.stringToBytes(korean)), korean);

        var url = "http://example.com/with-utf8-✓";
        assert.equal(util.bytesToString(util.stringToBytes(url)), url);

    });
});
