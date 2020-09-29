var nodeExternals = require("webpack-node-externals");

module.exports = {
    target: 'node',
    mode: 'development',
    entry: './src/server.js',
    resolve: {
        modules: ['server','node_modules'],
    },
    externals: [nodeExternals()],
};