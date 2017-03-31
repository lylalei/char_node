var webpack = require('webpack')
var path = require('path');

module.exports = {
  entry: './demo/js/src/entry.js',
  output: {
    path: __dirname,
    filename: './demo/js/build/bundle.js'
  },
  module: {
    loaders: [
    ]
  },
  resolve : {
    extensions : ['.js'],
    alias : {
    }
  }
};
