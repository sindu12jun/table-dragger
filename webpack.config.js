/**
 * Created by lijun on 2016/12/14.
 */
var webpack = require('webpack')
var path = require('path')
var projectRoot = path.resolve(__dirname, './')

module.exports = {
  entry: './docs/index.js',
  output: {
    path: './build',
    publicPath: 'build/',
    filename: 'build-docs.js'
  },
  resolve: {
    root: path.resolve('./'),
    extensions: ['', '.js'],
    fallback: [path.join(__dirname, '../node_modules')],
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  babel: {
    "presets": [
      "es2015",
      "stage-2"
    ],
    plugins: ['transform-runtime']
  },
  devtool: 'source-map'
};


if (process.env.NODE_ENV === 'production') {
  delete module.exports.devtool;
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ];
}
