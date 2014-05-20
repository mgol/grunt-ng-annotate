/**
 * grunt-ng-annotate
 * https://github.com/mzgol/grunt-ng-annotate
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        clean: {
            test: {
                src: ['test/tmp'],
            },
        },

        jshint: {
            options: {
                jshintrc: true,
            },
            all: {
                src: [
                    'Gruntfile.js',
                    'tasks/**/*.js',
                    'test/**/*.js',
                ],
            },
        },
        jscs: {
            all: {
                src: [
                    '<%= jshint.all.src %>',
                    '!test/tmp/**/*.js',
                ],
                options: {
                    config: '.jscs.json',
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
                    remove: true,
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
            outputFileSuffix: {
                options: {
                    add: true,
                    remove: true,
                    outputFileSuffix: '-suffix',
                    transformDest: null,
                },
                src: ['test/tmp/not-annotated.js'],
            },
            transformDest: {
                options: {
                    add: true,
                    remove: true,
                    transformDest: function (srcPath) {
                        return srcPath.replace(/\/fixtures\//, '/tmp/').replace(/\.js/, '.es5');
                    },
                },
                src: ['test/fixtures/not-annotated.js'],
            },
            singleQuotes: {
                options: {
                    add: true,
                    remove: true,
                    singleQuotes: true,
                },
                files: {
                    'test/tmp/not-annotated-singlequotes.js': ['test/fixtures/not-annotated.js'],
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
                files: [{
                    expand: true,
                    cwd: 'test/fixtures',
                    src: ['multiple-1.js', 'multiple-2.js'],
                    dest: 'test/tmp',
                }],
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
        'jshint',
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
