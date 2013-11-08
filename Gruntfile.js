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
        jshint: {
            options: {
                jshintrc: true,
            },
            all: [
                'Gruntfile.js',
                'tasks/*.js',
//                '<%= nodeunit.tests %>',
            ],
        },

        // Configuration to be run (and then tested).
        ngAnnotate: {
            options: {
                transformDest: undefined,
                outputFileSuffix: undefined,
                add: true,
                remove: false,
                regexp: undefined,
                ngAnnotateOptions: {},
            }
        },

        // Unit tests.
        // TODO
//        nodeunit: {
//            tests: ['test/*_test.js'],
//        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Load all grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('test', ['nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', [
        'jshint',
        'ngAnnotate',
//        'test', // TODO
    ]);
};
