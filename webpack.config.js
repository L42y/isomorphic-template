'use strict';

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
    rules: commonLoaders.concat([{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        loader: 'css-loader?sourceMap'
      })
    }])
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: isProduction
    }),
    new ExtractTextPlugin({
      filename: 'web.bundle.css'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env['NODE_ENV'])
      }
    })
  ].concat(isProduction ? [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    })
  ] : []),
  devtool: 'source-map'
}, {
  name: 'server-side rendering',
  cache: true,
  entry: './index',
  target: 'node',
  output: {
    path: './tmp/server',
    filename: 'server.bundle.js'
  },
  module: {
    rules: commonLoaders.concat([{
      test: /\.css$/,
      loader: 'css-loader/locals'
    }])
  },
  devtool: 'source-map',
  externals: [nodeExternals()]
}];
