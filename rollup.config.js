const terser = require('@rollup/plugin-terser');

module.exports = {
    input: 'utility.js',
    output: {
        file: 'utility.min.js',
        format: 'iife',
        name: 'UtilityBar'
    },
    plugins: [terser.default()]
};