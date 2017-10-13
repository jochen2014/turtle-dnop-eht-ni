let path = require('path');
let webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

let config = {
  entry: './src/index.js',
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new UglifyJSPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('style.css'),
  ],
  module: {
    rules: [ // "style-loader!css-loader!less-loader" can only be used with module.loaders;
      {
        test: /\.jsx?/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader",
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer({
                    browsers: ['last 2 versions'],
                  }),
                ],
              },
            },
            "less-loader"],
        }),
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$/i,
        use: 'file-loader',
      },
    ],
  },
};


module.exports = config;
