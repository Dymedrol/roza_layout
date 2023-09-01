const path = require('path');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: { main: './index.js' },
  output: {
    path: path.resolve(__dirname, 'build/'),
    filename: 'bundel.js'
  },
  watchOptions: {
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: [".js", ".jsx"]
        },
        use: {
          loader: "babel-loader"
        }
      },
      {
          test: /\.(less|css)$/,
          use:  [
            'style-loader',
            {
              loader: MiniCssExtractPlugin.loader,
            },
            { loader: 'css-loader', options: { url: false, sourceMap: true } },
            'less-loader'
          ]
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new CopyWebpackPlugin([
        {from:'source/js/plugins',to:'js'},
        {from:'source/css',to:'css'},
        {from:'source/img',to:'img'},
        {from:'source/fonts',to:'fonts'},
    ]),
  ]
};