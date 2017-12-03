const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const common = require('./_common.js');

// Used instead of __dirname.
const root = require('app-root-path') + '';

/**
 * Development configuration for webpack.
 *
 * Adds the following on top of the base configuration:
 * - Source-maps.
 * - Hot module reloading.
 * - Customizes the HTML output.
 * - Development server.
 */
module.exports = env =>
  common.config(
    {
      /**
       * Cheap simple source-map implementation.
       */
      devtool: 'eval',

      /**
       * Webpack plugins.
       */
      plugins: [
        // Will cause the relative path of the module to displayed with HMR.
        // https://webpack.js.org/plugins/named-modules-plugin/
        new webpack.NamedModulesPlugin(),

        // Hot Module Replacement.
        // https://webpack.js.org/plugins/hot-module-replacement-plugin/
        new webpack.HotModuleReplacementPlugin(),

        // Common global definitions.
        common.define(),

        // Generates an HTML5 entrypoint for all of the output bundles.
        // https://github.com/jantimon/html-webpack-plugin
        new HtmlWebpackPlugin({
          title: '[DEV]: Ludum Dare 40',
          template: './templates/index.html',
        }),
      ],

      /**
       * Development server.
       *
       * See https://webpack.js.org/configuration/dev-server/.
       */
      devServer: {
        contentBase: path.join(root, 'dist'),
        compress: true,
        hot: true,
        overlay: true,
        port: 8000,
        watchOptions: {
          ignored: /node_modules/,
        },
      },
    },
    env
  );
