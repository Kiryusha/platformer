const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src'),

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'tslint-loader'
      },
      {
        test: /\.(ts|js)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            }
          }
        ]
      },
    ]
  },

  devtool: 'cheap-module-source-map',
  devServer: {},

  plugins: [
    ...process.env.NODE_ENV === 'production' ? [new CleanWebpackPlugin()] : [],
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
  ]
};
