/**
 * grunt-ng-annotate
 * https://github.com/mzgol/grunt-ng-annotate
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

const path = require('path');
const cloneDeep = require('lodash.clonedeep');
const ngAnnotate = require('ng-annotate');

module.exports = function (grunt) {

    const getPathFromTo = (fromFile, toFile) =>
        path.relative(path.resolve(path.dirname(fromFile)), path.resolve(toFile))
            // URLs should have UNIX-y paths.
            .replace(/\\+/g, '/');

    const handleOptions = options => {
        const finalOptions = cloneDeep(options);

        if (!finalOptions.ngAnnotateOptions) {
            finalOptions.ngAnnotateOptions = {};
        }

        if (finalOptions.add == null) {
            finalOptions.ngAnnotateOptions.add = true;
        } else {
            finalOptions.ngAnnotateOptions.add = finalOptions.add;
            delete finalOptions.add;
        }

        if (finalOptions.remove == null) {
            finalOptions.ngAnnotateOptions.remove = false;
        } else {
            finalOptions.ngAnnotateOptions.remove = finalOptions.remove;
            delete finalOptions.remove;
        }

        if (finalOptions.regexp != null) {
            finalOptions.ngAnnotateOptions.regexp = finalOptions.regexp;
            delete finalOptions.regexp;
        }

        if (finalOptions.singleQuotes != null) {
            finalOptions.ngAnnotateOptions.single_quotes = finalOptions.singleQuotes;
            delete finalOptions.singleQuotes;
        }

        if (finalOptions.separator != null) {
            finalOptions.ngAnnotateOptions.separator = options.separator;
            delete finalOptions.separator;
        }

        if (finalOptions.sourceMap) {
            finalOptions.ngAnnotateOptions.map = {
                inline: options.sourceMap === true,
            };
        }

        if (options.transformDest != null) {
            grunt.fail.fatal([
                'The `transformDest` option is no longer supported.',
                'The following configuration:',
                '',
                '    app: {',
                '        options: {',
                '            transformDest: function (srcPath) {',
                '                return doSomethingWithSrcPath(srcPath);',
                '            },',
                '        },',
                '        src: [\'app/*.js\'],',
                '    },',
                '',
                'should be replaced by:',
                '',
                '    app: {',
                '        files: [',
                '           {',
                '               expand: true,',
                '               src: [\'app/*.js\'],',
                '               rename: function (destPath, srcPath) {',
                '                   return doSomethingWithSrcPath(srcPath);',
                '               },',
                '            },',
                '        ],',
                '    },',
            ].join('\n'));
        }

        if (options.outputFileSuffix != null) {
            grunt.fail.fatal([
                'The `outputFileSuffix` option is no longer supported.',
                'The following configuration:',
                '',
                '    app: {',
                '        options: {',
                '            outputFileSuffix: \'-annotated\',',
                '        },',
                '        src: [\'app/*.js\'],',
                '    },',
                '',
                'should be replaced by:',
                '',
                '    app: {',
                '        files: [',
                '            {',
                '               expand: true,',
                '               src: [\'app/*.js\'],',
                '               rename: function (destPath, srcPath) {',
                '                   return srcPath + \'-annotated\';',
                '               },',
                '            },',
                '        ],',
                '    },',
            ].join('\n'));
        }

        return finalOptions;
    };

    grunt.registerMultiTask('ngAnnotate',
        'Add, remove and rebuild AngularJS dependency injection annotations',

        function () {
            let filesNum = 0;
            let validRun = true;
            // Merge task-specific and/or target-specific options with these defaults.
            const options = handleOptions(this.options());


            const runNgAnnotate = (mapping, options) => {
                filesNum++;

                const ngAnnotateOptions = cloneDeep(options.ngAnnotateOptions);

                if (ngAnnotateOptions.map) {
                    if (mapping.src.length > 1) {
                        grunt.fail.fatal('The ngAnnotate task doesn\'t support ' +
                            'source maps with many-to-one mappings.');
                    }

                    ngAnnotateOptions.map.inFile = getPathFromTo(mapping.dest, mapping.src[0]);
                }

                // seperator for file concatenation; defaults to linefeed
                const separator = typeof ngAnnotateOptions.separator === 'string' ?
                    ngAnnotateOptions.separator :
                    grunt.util.linefeed;

                const concatenatedSource = mapping.src
                    .map(file => grunt.file.read(file))
                    .join(separator);

                const ngAnnotateOutput = ngAnnotate(concatenatedSource, ngAnnotateOptions);

                // Write the destination file.
                if (ngAnnotateOutput.errors) {
                    grunt.log.write(`Generating "${ mapping.dest }" from: "${
                        mapping.src.join('", "') }"...`);
                    grunt.log.error();
                    ngAnnotateOutput.errors.forEach(error => {
                        grunt.log.error(error);
                    });
                    return false;
                }

                // Write ngAnnotate output (and a source map if requested) to the target file.

                if (ngAnnotateOptions.map && !ngAnnotateOptions.map.inline) {
                    ngAnnotateOutput.src +=
                        `\n//# sourceMappingURL=${
                            getPathFromTo(mapping.dest, options.sourceMap) }`;
                    grunt.file.write(options.sourceMap, ngAnnotateOutput.map);
                }

                grunt.file.write(mapping.dest, ngAnnotateOutput.src);

                return true;
            };

            // Iterate over all specified file groups.
            this.files.forEach(mapping => {
                if (!runNgAnnotate(mapping, options)) {
                    validRun = false;
                }
            });

            if (validRun) {
                if (filesNum < 1) {
                    grunt.log.ok('No files provided to the ngAnnotate task.');
                } else {
                    grunt.log.ok(`${ filesNum + (filesNum === 1 ? ' file' : ' files')
                        } successfully annotated.`);
                }
            }
            return validRun;
        });

};
