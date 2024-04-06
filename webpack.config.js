const path = require('path');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    app: './src/client/index.ts',
    style: './src/scss/style.scss',
  },
  output: {
    path: path.resolve(__dirname, isProduction ? 'dist/public' : 'public'),
    filename: 'client/[name].bundle.js',
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].css',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
};