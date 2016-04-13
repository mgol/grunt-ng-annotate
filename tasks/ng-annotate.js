/**
 * grunt-ng-annotate
 * https://github.com/mzgol/grunt-ng-annotate
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

// Disable options that don't work in Node.js 0.12.
// Gruntfile.js & tasks/*.js are the only non-transpiled files.
/* eslint-disable no-var, no-eval */

var assert = require('assert');

module.exports = function (grunt) {
    try {
        assert.strictEqual(eval('(r => [...r])([2])[0]'), 2);
        return require('../src/ng-annotate')(grunt);
    } catch (e) {
        return require('../dist/src/ng-annotate')(grunt);
    }
};
