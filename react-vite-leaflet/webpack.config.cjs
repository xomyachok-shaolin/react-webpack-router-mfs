const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const deps = require('./package.json').dependencies;
// require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const publicPath = process.env.PUBLIC_PATH || 'auto';

const plugins = [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    minify: isProduction ? {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    } : false,
  }),
  new ModuleFederationPlugin({
    name: 'appTrack',
    filename: 'remoteEntry.js',
    exposes: {
      './AppTrackIndex': './src/bootstrap',
    },
    shared: {
      react: { singleton: true, eager: true, requiredVersion: deps.react },
      'react-dom': { singleton: true, eager: true, requiredVersion: deps['react-dom'] },
    },
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  }),
  new webpack.ProvidePlugin({
    L: 'leaflet',
  }),
];

if (isProduction) {
  plugins.push(new MiniCssExtractPlugin({
    ignoreOrder: true,
    filename: '[name].[contenthash].css',
    chunkFilename: '[id].[contenthash].css',
  }));
}

module.exports = {
  mode: isProduction ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name].[contenthash].js' : '[name].bundle.js',
    clean: true, // Clean the output directory before emit.
    publicPath,
  },
  devServer: {
    port: 5002,
    open: true,
    hot: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },  
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      ,  
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },   
      {
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.less$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: { '@primary-color': '#1890ff' },
              },
            },
          },
        ],
      },
    ],
  },
  plugins,
  optimization: {
    minimize: isProduction,
    minimizer: [new TerserPlugin()],
    // splitChunks: { 
    //   chunks: 'all',
    //   maxSize: 200000,
    // }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  stats: {
    children: true,
    errorDetails: true,
  },
};
