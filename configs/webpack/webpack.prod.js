const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
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
       * Webpack plugins.
       */
      plugins: [
        new UglifyJSPlugin(),
        
        // Common global definitions.
        common.define(),

        // Generates an HTML5 entrypoint for all of the output bundles.
        // https://github.com/jantimon/html-webpack-plugin
        new HtmlWebpackPlugin({
          title: 'Guard Captain (Ludum 40)',
          template: './templates/index.html',
        }),
      ],
    },
    env
  );
