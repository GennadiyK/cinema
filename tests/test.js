var assert = require('assert');
describe('Array', function() {
    describe('#testIsEditField()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, testIsEditField('.input-group'));
        });
    });
});