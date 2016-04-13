/**
 * grunt-ng-annotate
 * https://github.com/mgol/grunt-ng-annotate
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

// Disable options that don't work in Node.js 0.12.
// Gruntfile.js & tasks/*.js are the only non-transpiled files.
/* eslint-disable no-var, object-shorthand, prefer-arrow-callback, prefer-const,
 prefer-spread, prefer-reflect, prefer-template */

var fs = require('fs');
var assert = require('assert');
var spawn = require('cross-spawn-async');

var newNode;
try {
    assert.strictEqual(eval('(r => [...r])([2])[0]'), 2); // eslint-disable-line no-eval
    newNode = true;
} catch (e) {
    newNode = false;
}

var transformRelativePath = function transformRelativePath(filepath) {
    return newNode ? filepath : 'dist/' + filepath;
};

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        clean: {
            test: {
                src: [
                    'dist',
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
                    dest: transformRelativePath('test/tmp/not-annotated-es6.js'),
                    src: transformRelativePath('test/fixtures/not-annotated-es6.js'),
                }],
            },
            source: {
                options: {
                    sourceMap: true,
                    retainLines: true,
                },
                files: [
                    {
                        expand: true,
                        src: [
                            'src/**/*.js',
                            'test/**/*.js',
                            '!test/fixtures/**/*.js',
                        ],
                        dest: 'dist',
                    },
                ],
            },
        },

        copy: {
            testPreparation: {
                files: [{
                    dest: transformRelativePath('test/tmp/overwritten.js'),
                    src: transformRelativePath('test/fixtures/not-annotated.js'),
                }],
            },
            nonGenerated: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        src: [
                            'test/fixtures/**/*.js',
                        ],
                        dest: 'dist',
                    },
                ],
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
                    dest: transformRelativePath('test/tmp/partially-annotated-messy-default.js'),
                    src: transformRelativePath('test/fixtures/partially-annotated-messy.js'),
                }],
            },
            add: {
                options: {
                    add: true,
                    remove: false,
                },
                files: [{
                    dest: transformRelativePath('test/tmp/not-annotated.js'),
                    src: transformRelativePath('test/fixtures/not-annotated.js'),
                }],
            },
            remove: {
                options: {
                    add: false,
                    remove: true,
                },
                files: [{
                    dest: transformRelativePath('test/tmp/annotated.js'),
                    src: transformRelativePath('test/fixtures/annotated.js'),
                }],
            },
            addRemove: {
                options: {
                    add: true,
                    remove: true,
                },
                files: [{
                    dest: transformRelativePath('test/tmp/partially-annotated-messy-addremove.js'),
                    src: transformRelativePath('test/fixtures/partially-annotated-messy.js'),
                }],
            },
            regexp: {
                options: {
                    add: true,
                    remove: false,
                    regexp: /^matchedMod$/,
                },
                files: [{
                    dest: transformRelativePath('test/tmp/not-annotated-regexp.js'),
                    src: transformRelativePath('test/fixtures/not-annotated.js'),
                }],
            },
            srcDest: {
                files: [{
                    dest: transformRelativePath('test/tmp/concatenated.js'),
                    src: [
                        transformRelativePath('test/tmp/not-annotated.js'),
                        transformRelativePath('test/tmp/annotated.js'),
                    ],
                }],
            },
            srcDestSeparator: {
                options: {
                    separator: ';',
                },
                files: [{
                    dest: transformRelativePath('test/tmp/concatenated-separator.js'),
                    src: [
                        transformRelativePath('test/tmp/not-annotated.js'),
                        transformRelativePath('test/tmp/annotated.js'),
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
                    dest: transformRelativePath('test/tmp/not-annotated-singlequotes.js'),
                    src: transformRelativePath('test/fixtures/not-annotated.js'),
                }],
            },
            sourceMap: {
                options: {
                    add: true,
                    remove: false,
                    sourceMap: true,
                },
                files: [{
                    dest: transformRelativePath('test/tmp/not-annotated-source-map.js'),
                    src: transformRelativePath('test/fixtures/not-annotated.js'),
                }],
            },
            sourceMapNotInline: {
                options: {
                    add: true,
                    remove: false,
                    sourceMap: transformRelativePath(
                        'test/tmp/not-annotated-source-map-external.js.map'),
                },
                files: [{
                    dest: transformRelativePath('test/tmp/not-annotated-source-map-external.js'),
                    src: transformRelativePath('test/fixtures/not-annotated.js'),
                }],
            },
            sourceMapCombined: {
                options: {
                    add: true,
                    remove: false,
                    sourceMap: true,
                },
                files: [{
                    dest: transformRelativePath('test/tmp/not-annotated-es6-source-map.js'),
                    src: transformRelativePath('test/tmp/not-annotated-es6.js'),
                }],
            },
            ngAnnotateOptions: {
                options: {
                    singleQuotes: true,
                },
                files: [{
                    dest: transformRelativePath('test/tmp/not-annotated-ngannotateoptions.js'),
                    src: transformRelativePath('test/fixtures/not-annotated.js'),
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
                        cwd: transformRelativePath('test/fixtures'),
                        src: ['multiple-1.js', 'multiple-2.js'],
                        dest: transformRelativePath('test/tmp'),
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
                        dest: transformRelativePath('test/tmp/overwritten.js'),
                        src: transformRelativePath('test/tmp/overwritten.js'),
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
                src: transformRelativePath('test/spec/*.js'),
            },
        },
    });

    // Load all grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    // Actually load this plugin's task(s). Do it only if dist is present to prevent errors
    // in older Nodes. Mocha will re-run Grunt a couple of times when those files will already
    // be present.
    if (fs.existsSync(__dirname + '/dist')) {
        grunt.loadTasks('tasks');
    }

    grunt.registerTask('lint', [
        'eslint',
    ]);


    // In modern Node.js we just use the non-transpiled source as it makes it easier to debug;
    // in older version we transpile (but keep the lines).
    grunt.registerTask('build', [
        'copy:nonGenerated',
        'babel:source',
    ]);

    grunt.registerTask('testPreparation', [
        'copy:testPreparation',
        'babel:testPreparation',
    ]);

    grunt.registerTask('test', ['mochaTest']);

    grunt.registerTask('ngAnnotateAndTestSpawned', function () {
        var done = this.async();

        spawn('grunt', ['ngAnnotate', 'test'], {
            cwd: __dirname,
            stdio: 'inherit',
        }).on('close', function (code) {
            if (code === 0) {
                done();
                return;
            }
            grunt.log.error('`grunt ngAnnotate` failed with code ' + code);
            done(false);
        });
    });

    // By default, lint and run tests.
    grunt.registerTask('default', [
        'clean',
        'lint',
        'build',
        'testPreparation',
        'ngAnnotateAndTestSpawned',
    ]);
};
