const path = require('path');
const webpack = require('webpack');

/*
function getProdExternals() {
  return {
    'plotly.js-dist': {
      commonjs: 'plotly.js-dist',
      commonjs2: 'plotly.js-dist'
    },
    dygraphs: {
      commonjs: 'dygraphs',
      commonjs2: 'dygraphs'
    }
  };
}
*/

module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/swagger-stats': {
        target: 'http://localhost:3040'
      }
    }
  },
  pluginOptions: {
    quasar: {}
  },
  transpileDependencies: [/[\\\/]node_modules[\\\/]quasar[\\\/]/],
  configureWebpack: {
    //externals: process.env.NODE_ENV === 'production' ? getProdExternals() : {},
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
    /*
    resolve: {
      alias: {
        dashblocks: path.resolve(__dirname, '../dashblocks')
      },
      modules: [
        path.resolve('./node_modules'),
        path.resolve('./node_modules/dashblocks/node_modules')
      ]
    }
    */
  }
};
