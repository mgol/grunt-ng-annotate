'use strict';

// See https://prettier.io/docs/en/options.html
module.exports = {
    singleQuote: true,

    // JS files are not compiled to ES5 so trailing commas in function
    // parameters would break in older browsers.
    trailingComma: 'all',

    tabWidth: 4,
};
