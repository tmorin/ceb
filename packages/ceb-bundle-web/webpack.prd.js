const {merge} = require('webpack-merge');
const parent = require('../../webpack.prd');

module.exports = merge(parent, {
    output: {
        library: "ceb",
        filename: "ceb.min.js",
    }
});
