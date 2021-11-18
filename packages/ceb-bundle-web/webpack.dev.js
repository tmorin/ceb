const {merge} = require('webpack-merge');
const parent = require('../../webpack.dev');

module.exports = merge(parent, {
    output: {
        library: "ceb",
        filename: "ceb.js",
    }
});
