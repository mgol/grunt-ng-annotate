// Note: we don't need to test full ngAnnotate functionality here as that's already
// tested in ngAnnotate repository. We just need to check if we pass what we should
// to ngAnnotate, as well as our custom options.

'use strict';

const fs = require('fs');
const expect = require('expect.js');
const sourceMap = require('source-map');
const convertSourceMap = require('convert-source-map');

const SourceMapConsumer = sourceMap.SourceMapConsumer;

const readFile = path =>
    normalizeNewLines(fs.readFileSync(path, {encoding: 'utf8'}));

const normalizeNewLines = input => input
    .replace(/\r\n/g, '\n')
    .replace(/\r$/, '');

const readTmp = filename => readFile(`${ __dirname }/../tmp/${ filename }`);

const readFix = filename => readFile(`${ __dirname }/../fixtures/${ filename }`);

describe('grunt-ng-annotate API', () => {
    it('should add annotations by default and not remove ones', () => {
        expect(readTmp('partially-annotated-messy-default.js'))
            .to.be(readFix('annotated-messy.js'));
    });

    it('should add annotations when `add: true`', () => {
        expect(readTmp('not-annotated.js')).to.be(readFix('annotated.js'));
    });

    it('should remove annotations when `remove: true`', () => {
        expect(readTmp('annotated.js')).to.be(readFix('not-annotated.js'));
    });

    it('should both add and remove annotations when `add: true, remove: true`', () => {
        expect(readTmp('partially-annotated-messy-addremove.js')).to.be(readFix('annotated.js'));
    });

    it('should annotate only modules matching regexp', () => {
        expect(readTmp('not-annotated-regexp.js')).to.be(readFix('annotated-regexp.js'));
    });

    it('should concatenate source files and save into the destination path', () => {
        expect(readTmp('concatenated.js')).to.be(readFix('concatenated.js'));
    });

    it('should concatenate source files with separator and save to destination path', () => {
        expect(readTmp('concatenated-separator.js')).to.be(readFix('concatenated-separator.js'));
    });

    it('should respect the `singleQuotes` setting', () => {
        expect(readTmp('not-annotated-singlequotes.js')).to.be(readFix('annotated-single.js'));
    });

    it('should pass the `ngAnnotateOptions` object to ngAnnotate', () => {
        expect(readTmp('not-annotated-ngannotateoptions.js')).to.be(readFix('annotated-single.js'));
    });

    it('should pass the correct options when using multiple input sources', () => {
        expect(readTmp('multiple-1.js')).to.be(readFix('not-annotated.js'));
        expect(readTmp('multiple-2.js')).to.be(readFix('not-annotated.js'));
    });

    it('should successfully overwrite files if requested', () => {
        expect(readTmp('overwritten.js')).to.be(readFix('annotated.js'));
    });

    describe('source maps', () => {
        const getSourcePart = source => source.replace(/\n\/\/# sourceMappingURL=\S+/, '');

        it('should generate an inline source map by default', () => {
            const generated = readTmp('not-annotated-source-map.js');
            const existingMap = convertSourceMap.fromSource(generated).toObject();
            const smc = new SourceMapConsumer(existingMap);

            expect(smc.sources).to.eql(['../fixtures/not-annotated.js']);
            expect(smc.sourcesContent).to.eql([readFix('../fixtures/not-annotated.js')]);

            expect(getSourcePart(generated).trim()).to.be(readFix('annotated.js').trim());

            expect(
                smc.originalPositionFor({
                    line: 5,
                    column: 63,
                })).to.eql({
                line: 5,
                column: 35,
                source: smc.sources[0],
                name: null,
            });
        });

        it('should generate an external source map when asked', () => {
            const generated = readTmp('not-annotated-source-map-external.js');
            const smc = new SourceMapConsumer(readTmp('not-annotated-source-map-external.js.map'));

            expect(getSourcePart(generated).trim()).to.be(readFix('annotated.js').trim());

            expect(smc.sources).to.eql(['../fixtures/not-annotated.js']);
            expect(smc.sourcesContent).to.eql([readFix('not-annotated.js')]);
        });

        it('should combine source maps', () => {
            const generated = readTmp('not-annotated-es6-source-map.js');

            expect(getSourcePart(generated).trim()).to.be(readFix('annotated-es6.js').trim());

            const existingMap = convertSourceMap.fromSource(generated).toObject();
            const smc = new SourceMapConsumer(existingMap);

            expect(smc.sources).to.eql([
                'not-annotated-es6.js',
                '../fixtures/not-annotated-es6.js',
            ]);

            expect(
                smc.originalPositionFor({
                    line: 9,
                    column: 19,
                })).to.eql({
                line: 8,
                column: 22,
                source: smc.sources[smc.sources.length - 1],
                name: null,
            });
        });
    });
});
