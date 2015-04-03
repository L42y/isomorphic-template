'use strict';

module.exports = {
  cache: true,
  entry: './browser',
  output: {
    path: './tmp',
    filename: 'browser-bundle.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel-loader'}
    ]
  }
};
