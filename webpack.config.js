const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

// Sources:
// * https://www.typescriptlang.org/docs/handbook/react-&-webpack.html
// * https://webpack.js.org/concepts/
// * https://basarat.gitbooks.io/typescript/content/docs/quick/browser.html

module.exports = {
  // Entrypoint(s) to bundles.
  entry: './src/index.ts',

  // Output bundles.
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].bundle.map',
    path: path.resolve(__dirname, 'dist'),
  },

  // Enable source-maps.
  devtool: isProd ? 'hidden-source-map' : 'eval',

  resolve: {
    extensions: ['.ts', '.js', '.html'],
  },

  module: {
    rules: [{ enforce: 'pre', test: /\.ts$/, use: 'ts-loader' }],
  },

  plugins: [
    // Will cause the relative path of the module to displayed with HMR.
    // https://webpack.js.org/plugins/named-modules-plugin/
    new webpack.NamedModulesPlugin(),

    // Hot Module Replacement.
    // https://webpack.js.org/plugins/hot-module-replacement-plugin/
    new webpack.HotModuleReplacementPlugin(),

    // Generates an HTML5 entrypoint for all of the output bundles.
    // https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: 'Ludum Dare 40',
      template: './src/index.html',
    }),
  ],

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    hot: true,
    overlay: true,
    port: 8000,
  },
};
