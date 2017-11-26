const path = require('path');
const webpack = require('webpack');

// Used instead of __dirname.
const root = require('app-root-path') + '';

module.exports = {
  /**
   * Base configuration for webpack.
   *
   * @param extend Object to merge into the default options.
   * @returns {Object}
   */
  config: extend => {
    'use strict';
    return Object.assign(extend, {
      /**
       * Entrypoint to the bundles that should be output.
       */
      entry: {
        /**
         * Application itself.
         */
        app: './src/index.ts',

        /**
         * Dependencies.
         */
        vendor: ['debug', 'lodash', 'pixi', 'p2', 'phaser'],
      },

      /**
       * Output bundles.
       */
      output: {
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].bundle.js',
        path: path.resolve(root, 'dist'),
      },

      /**
       * Some node configuration that is required (unclear why).
       */
      node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
      },

      resolve: {
        alias: {
          assets: path.join(root, 'assets/'),
          p2: path.join(root, 'node_modules/phaser-ce/build/custom/p2.js'),
          pixi: path.join(root, 'node_modules/phaser-ce/build/custom/pixi.js'),
          phaser: path.join(
            root,
            'node_modules/phaser-ce/build/custom/phaser-split.js'
          ),
        },
        extensions: ['.ts', '.js', '.html'],
      },

      module: {
        rules: [
          {
            test: /assets(\/|\\)/,
            loader: 'file-loader?name=assets/[hash].[ext]',
          },
          { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
          { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
          { test: /p2\.js$/, loader: 'expose-loader?p2' },
          { test: /\.ts$/, use: 'ts-loader', exclude: '/node_modules/' },
        ],
      },
    });
  },

  /**
   * Returns an invocation of `webpack.DefinePlugin`.
   *
   * See:
   * * https://webpack.js.org/plugins/define-plugin/.
   * * https://blog.johnnyreilly.com/2016/07/using-webpacks-defineplugin-with-typescript.html.
   *
   * @param options
   * @return {Object}
   */
  define: options => {
    'use strict';
    return new webpack.DefinePlugin(
      Object.assign(options || {}, {
        __DEBUG: true,
        __DIMENSIONS: {
          WIDTH: 800,
          HEIGHT: 600,
        },
      })
    );
  },
};
