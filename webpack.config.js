var nodeExternals = require("webpack-node-externals");

module.exports = {
    target: 'node',
    mode: 'development',
    entry: './server.js',
    resolve: {
        modules: ['server','node_modules'],
    },
    externals: [nodeExternals()],
};