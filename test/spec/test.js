'use strict';

var fs = require('fs'),
    expect = require('expect.js');

function readFile(path) {
    return fs.readFileSync(path, {encoding: 'utf8'});
}

describe('ngAnnotate', function () {
    it('should add annotations', function () {
        expect(readFile('test/tmp/not-annotated.js')).to.be(readFile('test/fixtures/annotated.js'));
    });

    it('should remove annotations', function () {
        expect(readFile('test/tmp/annotated.js')).to.be(readFile('test/fixtures/not-annotated.js'));
    });
});
