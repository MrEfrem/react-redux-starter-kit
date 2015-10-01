import webpack from 'webpack';
import config  from '../../config';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';

const paths = config.get('utils_paths'),
    globals = config.get('globals');

const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  entry: {
    app: [
      paths.src('entry-points/client')
    ]
  },
  output: {
    filename: '[name].[hash].js',
    path: paths.dist('client'),
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin(Object.assign(config.get('globals'), {
      __CLIENT__: true,
      __SERVER__: false
    })),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      template: paths.src('index.html'),
      hash: true,
      filename: 'index.html',
      minify: globals.__PROD__,
      inject: 'body'
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: config.get('utils_aliases')
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: paths.project(config.get('dir_src')),
        loader: 'babel',
        query: {
          optional: ['runtime'],
          stage: 0,
          "plugins" : [
            "typecheck"
          ],
          env: {
            development: {
              plugins: [
                'react-transform',
                "typecheck"
              ],
              extra: {
                "react-transform": {
                  "transforms": [{
                    "transform" : "react-transform-catch-errors",
                    "imports" : ["react", "redbox-react"]
                  }]
                }
              }
            }
          }
        }
      },
      {
        test    : /\.css$/,
        loader : ExtractTextPlugin.extract(`css-loader?modules&importLoaders=1&localIdentName=${globals.__PROD__?'[hash:base64]':'[name]---[local]---[hash:base64:5]'}!postcss-loader`)
      }
    ]
  },
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
  eslint: {
    configFile: paths.project('.eslintrc'),
    failOnError: globals.__PROD__,
    emitWarning: globals.__DEV__
  }
};

// ----------------------------------
// Vendor Bundle Configuration
// ----------------------------------
webpackConfig.entry.vendor = config.get('vendor_dependencies');

// NOTE: this is a temporary workaround. I don't know how to get Karma
// to include the vendor bundle that webpack creates, so to get around that
// we remove the bundle splitting when webpack is used with Karma.
const commonChunkPlugin = new webpack.optimize.CommonsChunkPlugin(
    'vendor', (globals.__HMR__ ? 'vendor.js' : '[name].[hash].js')
);
commonChunkPlugin.__KARMA_IGNORE__ = true;
webpackConfig.plugins.push(commonChunkPlugin);

// ----------------------------------
// CSS Bundle Configuration
// ----------------------------------
webpackConfig.plugins.push(new ExtractTextPlugin(globals.__HMR__ ? 'app.css' : '[name].[contenthash].css'));

// ----------------------------------
// Environment-Specific Defaults
// ----------------------------------
if (globals.__HMR__) {
  webpackConfig.output.publicPath = config.get('webpack_public_path');
  webpackConfig.output.filename = 'app.js';
  webpackConfig.module.loaders.forEach(loader => {
    if (loader.loader === 'babel') {
      loader.query.env.development.extra['react-transform'].transforms.push({
        "transform" : "react-transform-hmr",
        "imports" : ["react"],
        "locals" : ["module"]
      });
    }
  });
}
if (globals.__DEV__) {
  webpackConfig.entry.app.push(
      `webpack-dev-server/client?${config.get('webpack_public_path')}`,
      `webpack/hot/only-dev-server`
  );

  webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin()
  );
}

if (globals.__PROD__) {
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        'unused': true,
        'dead_code': true
      }
    })
  );
}

/*if (!globals.__HMR__) {
  // Compile CSS to its own file.
  webpackConfig.module.loaders = webpackConfig.module.loaders.map(loader => {
    if (/css/.test(loader.test)) {
      const [first, ...rest] = loader.loaders;

      loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
      delete loader.loaders;
    }

    return loader;
  });
}*/
// ------------------------------------
// Optional Configuration
// ------------------------------------
if (
    !globals.__DEV__ ||
    (globals.__DEV__ && config.get('webpack_lint_in_dev'))
) {
  webpackConfig.module.preLoaders = [
    {
      test: /\.(js|jsx)$/,
      loaders: ['eslint-loader'],
      include: paths.project(config.get('dir_src'))
    }
  ];
}

export default webpackConfig;


