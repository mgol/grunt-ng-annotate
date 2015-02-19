// Note: we don't need to test full ngAnnotate functionality here as that's already
// tested in ngAnnotate repository. We just need to check if we pass what we should
// to ngAnnotate, as well as our custom options.

'use strict';

var fs = require('fs'),
    expect = require('expect.js');

function readFile(path) {
    return normalizeNewLines(fs.readFileSync(path, {encoding: 'utf8'}));
}

function normalizeNewLines(input) {
    return input
        .replace(/\r\n/g, '\n')
        .replace(/\r$/, '');
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

    it('should concatenate source files with separator and save to destination path', function () {
        expect(readTmp('concatenated-separator.js')).to.be(readFix('concatenated-separator.js'));
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

    describe('source maps', function () {
        function getSourceMapPart(source) {
            var sourceMapPart = source.match(/\/\/# sourceMappingURL=(\S+)/);
            return sourceMapPart && sourceMapPart[1];
        }

        function getSourcePart(source) {
            return source.replace(/\n\/\/# sourceMappingURL=\S+/, '');
        }

        it('should generate an inline source map by default', function () {
            var generated = readTmp('not-annotated-source-map.js');
            var sourceMapPart = getSourceMapPart(generated);
            var sourcePart = getSourcePart(generated);

            expect(sourcePart).to.be(readFix('annotated.js'));
            expect(sourceMapPart.length).to.be.greaterThan(0);
        });

        it('should generate an external source map when asked', function () {
            var map;
            expect(function () {
                map = JSON.parse(readTmp('not-annotated-source-map-external.js.map'));
            }).to.not.throwException();

            var generated = readTmp('not-annotated-source-map-external.js');
            var sourceMapPart = getSourceMapPart(generated);
            var sourcePart = getSourcePart(generated);

            expect(sourcePart).to.be(readFix('annotated.js'));
            expect(sourceMapPart).to.be('not-annotated-source-map-external.js.map');

            expect(map.sources).to.eql(['../fixtures/not-annotated.js']);

            expect(map.sourcesContent.length).to.be(1);
            expect(normalizeNewLines(map.sourcesContent[0])).to.be(readFix('not-annotated.js'));
        });
    });
});
