'use strict';

const webpack = require('webpack');

const isProduction = process.env['NODE_ENV'] === 'production';

const commonLoaders = [{
  test: /\.js$/,
  loader: 'babel-loader'
}];

module.exports = [{
  name: 'client-side',
  cache: true,
  entry: './index.web',
  output: {
    path: './tmp/web',
    filename: 'web.bundle.js'
  },
  module: {
    loaders: commonLoaders
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env['NODE_ENV'])
      }
    }),
  ].concat(isProduction ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin()
  ] : []),
  devtool: 'source-map'
}, {
  name: 'server-side rendering',
  cache: true,
  entry: './index',
  target: 'node',
  output: {
    path: './tmp/server',
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: commonLoaders
  },
  devtool: 'source-map',
  externals: /^[a-z\/\-0-9]+$/
}];
