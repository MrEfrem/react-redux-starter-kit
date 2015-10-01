import webpack from 'webpack';
import fs      from 'fs';
import config  from '../../config';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';

const paths   = config.get('utils_paths'),
      globals = config.get('globals');

const webpackConfig = {
  name    : 'server',
  target  : 'node',
  entry   : {
    app : [
      paths.src('entry-points/server')
    ]
  },
  // Don't include npm packages since these can be imported at runtime
  // from the Koa application.
  externals : fs.readdirSync('node_modules').filter(x => x !== '.bin'),
  output : {
    filename : 'index.js',
    path     : paths.dist('server'),
    libraryTarget : 'commonjs2'
  },
  plugins : [
    new webpack.DefinePlugin(Object.assign(config.get('globals'), {
      __SERVER__ : true,
      __CLIENT__ : false
    })),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin(globals.__HMR__ ? 'app.css' : '[name].[contenthash].css')
  ],
  resolve : {
    extensions : ['', '.js', '.jsx'],
    alias : config.get('utils_aliases')
  },
  module : {
    preLoaders : [
      {
        test : /\.(js|jsx)$/,
        loaders : ['eslint-loader'],
        include : paths.project(config.get('dir_src'))
      }
    ],
    loaders : [
      {
        test    : /\.(js|jsx)$/,
        include :  paths.project(config.get('dir_src')),
        loader: 'babel',
        query: {
          optional: ['runtime'],
          stage: 0,
          "plugins" : [
            "typecheck"
          ]
        }
      },
      {
        test    : /\.css$/,
        loader : ExtractTextPlugin.extract(`css-loader?modules&importLoaders=1&localIdentName=${globals.__PROD__?'[hash:base64]':'[name]---[local]---[hash:base64:5]'}!postcss-loader`)
      }
    ]
  },
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
  eslint : {
    configFile  : paths.project('.eslintrc'),
    failOnError : globals.__PROD__
  }
};

export default webpackConfig;
