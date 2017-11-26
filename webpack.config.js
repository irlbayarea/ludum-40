const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

// Sources:
// * https://www.typescriptlang.org/docs/handbook/react-&-webpack.html
// * https://webpack.js.org/concepts/
// * https://basarat.gitbooks.io/typescript/content/docs/quick/browser.html

module.exports = {
  // Entrypoint(s) to bundles.
  entry: {
    app: './src/index.ts',
    vendor: ['pixi', 'p2', 'phaser'],
  },

  // Output bundles.
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].bundle.map',
    path: path.resolve(__dirname, 'dist'),
  },

  // Enable source-maps.
  devtool: isProd ? 'hidden-source-map' : 'eval',

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },

  resolve: {
    alias: {
      assets: path.join(__dirname, 'assets/'),
      p2: path.join(__dirname, 'node_modules/phaser-ce/build/custom/p2.js'),
      pixi: path.join(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
      phaser: path.join(
        __dirname,
        'node_modules/phaser-ce/build/custom/phaser-split.js'
      ),
    },
    extensions: ['.ts', '.js', '.html'],
  },

  module: {
    rules: [
      { test: /assets(\/|\\)/, loader: 'file-loader?name=assets/[hash].[ext]' },
      { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
      { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
      { test: /p2\.js$/, loader: 'expose-loader?p2' },
      { test: /\.ts$/, use: 'ts-loader', exclude: '/node_modules/' },
    ],
  },

  plugins: [
    // Will cause the relative path of the module to displayed with HMR.
    // https://webpack.js.org/plugins/named-modules-plugin/
    new webpack.NamedModulesPlugin(),

    // Hot Module Replacement.
    // https://webpack.js.org/plugins/hot-module-replacement-plugin/
    new webpack.HotModuleReplacementPlugin(),

    new CleanWebpackPlugin([path.join(__dirname, 'dist')]),

    // Generates an HTML5 entrypoint for all of the output bundles.
    // https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: 'DEV MODE: Ludum Dare 40',
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
    watchOptions: {
      ignored: /node_modules/,
    },
  },
};
