const CopyPlugin = require('copy-webpack-plugin')
const CSSExtractPlugin = require('mini-css-extract-plugin')
const generateImports = require('../html/generate-imports')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const path = require('path')

const outputPaths = {
  'build': 'dist',
  'build:dev': 'dev',
  'build:proto': 'proto'
}

module.exports = context => {
  const config = require('./base')(context)

  /* eslint-disable indent */

  if (process.env.PANGOLIN_ENV === 'build:dev') {
    config.entry('main')
      .add(generateImports.components(context))
      .add(generateImports.prototypes(context))
  }

  if (process.env.PANGOLIN_ENV === 'build:proto') {
    config.entry('main')
      .add(generateImports.prototypes(context))
  }

  config.output
    .path(path.join(context, outputPaths[process.env.PANGOLIN_ENV]))

  config
    .mode('production')
    .devtool('source-map')

  config.optimization
    .splitChunks({
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    })

  config.module
    .rule('css')
      .use('css-extract-loader')
        .loader(CSSExtractPlugin.loader)
        .before('css-loader')
        .end()
      .use('css-loader')
        .tap(options => ({
          ...options,
          minimize: { mergeRules: false }
        }))

  config
    .plugin('friendly-errors')
    .tap(options => [{
      ...options,
      clearConsole: false
    }])

  config
    .plugin('css-extract')
    .use(CSSExtractPlugin, [{
      filename: 'css/[name].css'
    }])

  config
    .plugin('copy')
    .use(CopyPlugin, [[
      {
        from: 'src/assets',
        to: 'assets'
      },
      {
        from: path.join(__dirname, '../../docs/dist'),
        to: 'pangolin',
        ignore: [process.env.PANGOLIN_ENV === 'build:dev' ? '' : '*']
      }
    ]])

  config
    .plugin('imagemin')
    .use(ImageminPlugin, [{
      test: /\.(jpe?g|png|gif|svg)$/i,
      jpegtran: {
        progressive: true
      }
    }])

  /* eslint-enable indent */

  return config
}