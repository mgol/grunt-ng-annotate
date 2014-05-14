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
                transformDest: function (srcPath) {
                    // Transform files from test/fixtures to test/tmp.
                    return srcPath.replace(/\/fixtures\//, '/tmp/');
                },
                outputFileSuffix: undefined,
                add: true,
                remove: false,
                regexp: undefined,
                ngAnnotateOptions: {},
                singleQuotes: true,
            },
            add: {
                src: ['test/fixtures/not-annotated.js'],
            },
            remove: {
                options: {
                    add: false,
                    remove: true,
                },
                src: ['test/fixtures/annotated.js'],
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
