const webpack = require('webpack');

module.exports = function override(config, env) {
  const videojsPlugin = new webpack.ProvidePlugin({
    videojs: 'video.js/dist/video.cjs.js'
  });
  const videojsAlias = {
    videojs: 'video.js',
    WaveSurfer: 'wavesurfer.js'
  };
  config.resolve.alias = { ...config.resolve.alias, ...videojsAlias };
  config.plugins.push(videojsPlugin);
  return config;
};
