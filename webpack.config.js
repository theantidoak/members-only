const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/client/index.ts',
  output: {
    path: path.resolve(__dirname, isProduction ? 'dist/public/client' : 'public/client'),
    filename: 'bundle.js',
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};