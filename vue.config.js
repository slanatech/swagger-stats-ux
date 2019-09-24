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
  transpileDependencies: [/[\\\/]node_modules[\\\/]quasar[\\\/]/]
};
