# grunt-ng-annotate

> Add, remove and rebuild AngularJS dependency injection annotations.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ng-annotate --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ng-annotate');
```

## The "ngAnnotate" task

### Overview
In your project's Gruntfile, add a section named `ngAnnotate` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    ngAnnotate: {
        options: {
            // Task-specific options go here.
        },
        your_target: {
            // Target-specific file lists and/or options go here.
        },
    },
})
```

#### Options

The `ngAnnotate` task accepts a couple of options:

```js
{
    // Tells if ngAnnotate should add annotations (true by default).
    add: true|false,

    // Tells if ngAnnotate should remove annotations (false by default).
    remove: true|false,

    // If provided, only strings matched by the regexp are interpreted as module names.
    // See README of ng-annotate for further details: https://npmjs.org/package/ng-annotate
    regexp: regexp,

    // If files are provided without a destination, each file is processed
    // separately and each of them is saved under original name with appended suffix provided here.
    outputFileSuffix: string,

    // If files are provided without a destination and this option is set, each file is processed
    // separately and each of them is saved under original name processed by this function.
    transformDest: function (sourcePath) {},
}
```

Note that both `add` and `remove` options can be set to true; in such a case `ngAnnotate` first removes
annotations and then re-adds them (it can be used to check if annotations were provided correctly).

### Usage Examples

TODO

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Laboratorium EE. Licensed under the MIT license.
