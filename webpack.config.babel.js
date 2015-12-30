'use strict';

let commonLoaders = [{
  test: /\.js$/,
  query: {
    presets: ['react', 'es2015', 'stage-2']
  },
  loader: 'babel'
}];

module.exports = [{
  name: 'client-side',
  cache: true,
  entry: './index.web',
  output: {
    path: './tmp',
    filename: 'web.bundle.js'
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
  externals: /^[a-z\/\-0-9]+$/
}];
