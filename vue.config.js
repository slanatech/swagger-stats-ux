const path = require('path');
const http = require('http');
const webpack = require('webpack');

module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/swagger-stats': {
        target: 'http://localhost:3040',
        // This enables keepalive via proxy
        // See https://github.com/http-party/node-http-proxy/issues/767
        agent: http.globalAgent
      }
    }
  },
  pluginOptions: {
    quasar: {
      treeShake: true
    }
  },
  transpileDependencies: [/[\\\/]node_modules[\\\/]quasar[\\\/]/],
  configureWebpack: {
    //externals: process.env.NODE_ENV === 'production' ? getProdExternals() : {},
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    resolve: {
      symlinks: false
    }
  }
};
