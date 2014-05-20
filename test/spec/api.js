// Note: we don't need to test full ngAnnotate functionality here as that's already
// tested in ngAnnotate repository. We just need to check if we pass what we should
// to ngAnnotate, as well as our custom options.

'use strict';

var fs = require('fs'),
    expect = require('expect.js');

function readFile(path) {
    return fs.readFileSync(path, {encoding: 'utf8'});
}

function readTmp(filename) {
    return readFile('test/tmp/' + filename);
}

function readFix(filename) {
    return readFile('test/fixtures/' + filename);
}

describe('grunt-ng-annotate API', function () {
    it('should add annotations by default and not remove ones', function () {
        expect(readTmp('partially-annotated-messy-default.js')).to.be(readFix('annotated-messy.js'));
    });

    it('should add annotations when `add: true`', function () {
        expect(readTmp('not-annotated.js')).to.be(readFix('annotated.js'));
    });

    it('should remove annotations when `remove: true`', function () {
        expect(readTmp('annotated.js')).to.be(readFix('not-annotated.js'));
    });

    it('should both add and remove annotations when `add: true, remove: true`', function () {
        expect(readTmp('partially-annotated-messy-addremove.js')).to.be(readFix('annotated.js'));
    });

    it('should annotate only modules matching regexp', function () {
        expect(readTmp('not-annotated-regexp.js')).to.be(readFix('annotated-regexp.js'));
    });

    it('should concatenate source files and save into the destination path', function () {
        expect(readTmp('concatenated.js')).to.be(readFix('concatenated.js'));
    });

    it('should save the transformed file into the source path with added suffix', function () {
        expect(readTmp('not-annotated.js-suffix')).to.be(readFix('annotated.js'));
    });

    it('should save the transformed file into the source path transformed via `transformDest`', function () {
        expect(readTmp('not-annotated.es5')).to.be(readFix('annotated.js'));
    });

    it('should respect the `singleQuotes` setting', function () {
        expect(readTmp('not-annotated-singlequotes.js')).to.be(readFix('annotated-single.js'));
    });

    it('should pass the `ngAnnotateOptions` object to ngAnnotate', function () {
        expect(readTmp('not-annotated-ngannotateoptions.js')).to.be(readFix('annotated-single.js'));
    });

    it('should pass the correct options when using multiple input sources', function () {
        expect(readTmp('multiple-1.js')).to.be(readFix('not-annotated.js'));
        expect(readTmp('multiple-2.js')).to.be(readFix('not-annotated.js'));
    });
});
