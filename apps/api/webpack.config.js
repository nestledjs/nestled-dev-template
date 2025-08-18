const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  mode: process.env.NODE_ENV || 'development',
  entry: path.resolve(__dirname, 'src/main.ts'),
  output: {
    path: path.resolve(__dirname, '../../dist/apps/api'),
    filename: 'main.js',
  },
  optimization: {
    minimize: false, // Disable minification to prevent GraphQL schema issues
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../../tsconfig.base.json'),
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/,
          path.resolve(__dirname, '../../libs/api/prisma/src/lib/prisma-generated')
        ],
      },

    ],
  },
  externals: [
    nodeExternals({
      allowlist: [
        /^@nestled-template\/api/, // allow your own libs
      ],
      // Manually exclude Prisma internals if needed
      function ({ request }, callback) {
        if (request && request.includes('@prisma/client')) {
          return callback(null, 'commonjs @prisma/client')
        }
        if (request && request.includes('.prisma/client')) {
          return callback(null, 'commonjs .prisma/client')
        }
        if (request && request === '@nestled-template/api/prisma') {
          return callback(null, 'commonjs @nestled-template/api/prisma')
        }
        callback()
      }
    })
  ]
};
