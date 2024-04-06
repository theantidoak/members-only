const path = require('path');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    app: './src/client/index.ts',
    style: './src/scss/main.scss',
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
    ...(isProduction ? [new FixStyleOnlyEntriesPlugin()] : []),
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].css',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
};