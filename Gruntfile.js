/**
 * grunt-ng-annotate
 * https://github.com/mgol/grunt-ng-annotate
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

const spawn = require('cross-spawn');

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        clean: {
            test: {
                src: [
                    'test/tmp',
                ],
            },
        },

        babel: {
            testPreparation: {
                options: {
                    sourceMap: 'inline',
                },
                files: [{
                    dest: 'test/tmp/not-annotated-es6.js',
                    src: 'test/fixtures/not-annotated-es6.js',
                }],
            },
        },

        copy: {
            testPreparation: {
                files: [{
                    dest: 'test/tmp/overwritten.js',
                    src: 'test/fixtures/not-annotated.js',
                }],
            },
        },

        eslint: {
            all: {
                src: [
                    'Gruntfile.js',
                    'src',
                    'tasks',
                    'test',
                ],
            },
        },

        // Configuration to be run (and then tested).
        ngAnnotate: {
            options: {
                ngAnnotateOptions: {},
            },
            default: {
                files: [{
                    dest: 'test/tmp/partially-annotated-messy-default.js',
                    src: 'test/fixtures/partially-annotated-messy.js',
                }],
            },
            add: {
                options: {
                    add: true,
                    remove: false,
                },
                files: [{
                    dest: 'test/tmp/not-annotated.js',
                    src: 'test/fixtures/not-annotated.js',
                }],
            },
            remove: {
                options: {
                    add: false,
                    remove: true,
                },
                files: [{
                    dest: 'test/tmp/annotated.js',
                    src: 'test/fixtures/annotated.js',
                }],
            },
            addRemove: {
                options: {
                    add: true,
                    remove: true,
                },
                files: [{
                    dest: 'test/tmp/partially-annotated-messy-addremove.js',
                    src: 'test/fixtures/partially-annotated-messy.js',
                }],
            },
            regexp: {
                options: {
                    add: true,
                    remove: false,
                    regexp: /^matchedMod$/,
                },
                files: [{
                    dest: 'test/tmp/not-annotated-regexp.js',
                    src: 'test/fixtures/not-annotated.js',
                }],
            },
            srcDest: {
                files: [{
                    dest: 'test/tmp/concatenated.js',
                    src: [
                        'test/tmp/not-annotated.js',
                        'test/tmp/annotated.js',
                    ],
                }],
            },
            srcDestSeparator: {
                options: {
                    separator: ';',
                },
                files: [{
                    dest: 'test/tmp/concatenated-separator.js',
                    src: [
                        'test/tmp/not-annotated.js',
                        'test/tmp/annotated.js',
                    ],
                }],
            },
            singleQuotes: {
                options: {
                    add: true,
                    remove: false,
                    singleQuotes: true,
                },
                files: [{
                    dest: 'test/tmp/not-annotated-singlequotes.js',
                    src: 'test/fixtures/not-annotated.js',
                }],
            },
            sourceMap: {
                options: {
                    add: true,
                    remove: false,
                    sourceMap: true,
                },
                files: [{
                    dest: 'test/tmp/not-annotated-source-map.js',
                    src: 'test/fixtures/not-annotated.js',
                }],
            },
            sourceMapNotInline: {
                options: {
                    add: true,
                    remove: false,
                    sourceMap: 'test/tmp/not-annotated-source-map-external.js.map',
                },
                files: [{
                    dest: 'test/tmp/not-annotated-source-map-external.js',
                    src: 'test/fixtures/not-annotated.js',
                }],
            },
            sourceMapCombined: {
                options: {
                    add: true,
                    remove: false,
                    sourceMap: true,
                },
                files: [{
                    dest: 'test/tmp/not-annotated-es6-source-map.js',
                    src: 'test/tmp/not-annotated-es6.js',
                }],
            },
            ngAnnotateOptions: {
                options: {
                    singleQuotes: true,
                },
                files: [{
                    dest: 'test/tmp/not-annotated-ngannotateoptions.js',
                    src: 'test/fixtures/not-annotated.js',
                }],
            },
            multipleFileSources: {
                options: {
                    add: false,
                    remove: true,
                },
                files: [
                    {
                        expand: true,
                        cwd: 'test/fixtures',
                        src: ['multiple-1.js', 'multiple-2.js'],
                        dest: 'test/tmp',
                    },
                ],
            },
            overwrittenSource: {
                options: {
                    add: true,
                    remove: false,
                },
                files: [
                    {
                        dest: 'test/tmp/overwritten.js',
                        src: 'test/tmp/overwritten.js',
                    },
                ],
            },
        },

        // Unit tests.
        mochaTest: {
            all: {
                options: {
                    reporter: 'spec',
                },
                src: 'test/spec/*.js',
            },
        },
    });

    // Load all grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    // Load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.registerTask('lint', [
        'eslint',
    ]);


    grunt.registerTask('testPreparation', [
        'copy:testPreparation',
        'babel:testPreparation',
    ]);

    grunt.registerTask('test', ['mochaTest']);

    grunt.registerTask('ngAnnotateAndTestSpawned', function () {
        const done = this.async();

        spawn('grunt', ['ngAnnotate', 'test'], {
            cwd: __dirname,
            stdio: 'inherit',
        }).on('close', code => {
            if (code === 0) {
                done();
                return;
            }
            grunt.log.error(`'\`grunt ngAnnotate\` failed with code ${ code }`);
            done(false);
        });
    });

    // By default, lint and run tests.
    grunt.registerTask('default', [
        'clean',
        'lint',
        'testPreparation',
        'ngAnnotateAndTestSpawned',
    ]);
};
