/**
 * Created by lijun on 2016/12/14.
 */
var config = require('./webpack.config.js')

config.entry = {
  'table-dragger': './src/index.js',
}

config.output = {
  filename: './dist/[name].js',
  library: 'tableDragger',
  libraryTarget: 'umd'
}

module.exports = config
