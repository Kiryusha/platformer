const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const ASSETS_URL = {
  production: JSON.stringify('./assets'),
  development: JSON.stringify('../../assets'),
}

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
              name: 'assets/images/[name].[ext]',
            }
          }
        ]
      },
      {
        test: /\.(ogg|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/sounds/[name].[ext]',
            }
          }
        ]
      },
    ]
  },

  devtool: 'cheap-module-source-map',
  devServer: {},

  plugins: [
    ...process.env.NODE_ENV === 'production' ? [
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: 'src/assets/levels/',
            to: 'assets/levels/',
            flatten: true,
          },
        ],
      }),
    ] : [],
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new webpack.DefinePlugin({
      'ASSETS_URL': ASSETS_URL[environment],
    })
  ]
};
