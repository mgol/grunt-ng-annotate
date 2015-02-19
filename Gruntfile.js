/**
 * grunt-ng-annotate
 * https://github.com/mzgol/grunt-ng-annotate
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        clean: {
            test: {
                src: ['test/tmp'],
            },
        },

        eslint: {
            all: {
                src: [
                    'Gruntfile.js',
                    'tasks',
                    'test',
                ],
            },
        },

        jscs: {
            all: {
                src: [
                    'Gruntfile.js',
                    'tasks/**/*.js',
                    'test/**/*.js',
                ],
                options: {
                    config: '.jscsrc',
                },
            },
        },

        // Configuration to be run (and then tested).
        ngAnnotate: {
            options: {
                ngAnnotateOptions: {},
            },
            default: {
                files: {
                    'test/tmp/partially-annotated-messy-default.js': ['test/fixtures/partially-annotated-messy.js'],
                },
            },
            add: {
                options: {
                    add: true,
                    remove: false,
                },
                files: {
                    'test/tmp/not-annotated.js': ['test/fixtures/not-annotated.js'],
                },
            },
            remove: {
                options: {
                    add: false,
                    remove: true,
                },
                files: {
                    'test/tmp/annotated.js': ['test/fixtures/annotated.js'],
                },
            },
            addRemove: {
                options: {
                    add: true,
                    remove: true,
                },
                files: {
                    'test/tmp/partially-annotated-messy-addremove.js': ['test/fixtures/partially-annotated-messy.js'],
                },
            },
            regexp: {
                options: {
                    add: true,
                    remove: false,
                    regexp: /^matchedMod$/,
                },
                files: {
                    'test/tmp/not-annotated-regexp.js': ['test/fixtures/not-annotated.js'],
                },
            },
            srcDest: {
                files: {
                    'test/tmp/concatenated.js': [
                        'test/tmp/not-annotated.js',
                        'test/tmp/annotated.js',
                    ],
                },
            },
            srcDestSeparator: {
                options: {
                    separator: ';',
                },
                files: {
                    'test/tmp/concatenated-separator.js': [
                        'test/tmp/not-annotated.js',
                        'test/tmp/annotated.js',
                    ],
                },
            },
            singleQuotes: {
                options: {
                    add: true,
                    remove: false,
                    singleQuotes: true,
                },
                files: {
                    'test/tmp/not-annotated-singlequotes.js': ['test/fixtures/not-annotated.js'],
                },
            },
            sourceMap: {
                options: {
                    add: true,
                    remove: false,
                    sourceMap: true,
                },
                files: {
                    'test/tmp/not-annotated-source-map.js': ['test/fixtures/not-annotated.js'],
                },
            },
            sourceMapNotInline: {
                options: {
                    add: true,
                    remove: false,
                    sourceMap: 'test/tmp/not-annotated-source-map-external.js.map',
                },
                files: {
                    'test/tmp/not-annotated-source-map-external.js': ['test/fixtures/not-annotated.js'],
                },
            },
            ngAnnotateOptions: {
                options: {
                    singleQuotes: true,
                },
                files: {
                    'test/tmp/not-annotated-ngannotateoptions.js': ['test/fixtures/not-annotated.js'],
                },
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
        },

        // Unit tests.
        mochaTest: {
            all: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/spec/*.js'],
            },
        },
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Load all grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('lint', [
        'eslint',
        'jscs',
    ]);

    // By default, lint and run tests.
    grunt.registerTask('default', [
        'clean',
        'lint',
        'ngAnnotate',
        'mochaTest',
    ]);
};
