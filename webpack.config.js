'use strict';

var commonLoaders = [
  {test: /\.js$/, loader: 'babel-loader'}
];

module.exports = [{
  name: 'client-side',
  cache: true,
  entry: './browser',
  output: {
    path: './tmp',
    filename: 'browser.bundle.js'
  },
  module: {
    loaders: commonLoaders
  },
  devtool: 'inline-source-map'
}, {
  name: 'server-side rendering',
  cache: true,
  entry: './index',
  target: 'node',
  output: {
    path: './tmp',
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: commonLoaders
  },
  externals: /^[a-z\-0-9]+$/
}];
