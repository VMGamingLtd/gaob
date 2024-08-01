  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  if (process.env.NODE_ENV !== 'production') {
    module.exports = {
      mode: 'development',
      entry: [
        './src/index.ts',
        './src/App.tsx',
      ],
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: {
              loader: 'ts-loader',
              options: {
                configFile: 'tsconfig.json'
              },
            },
            exclude: /node_modules/,
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
      resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
      },
      output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
      },
      plugins: [new HtmlWebpackPlugin()],
    };
  } else {
    module.exports = {
      mode: 'production',
      entry: [
        './src/index.ts',
        './src/App.tsx',
      ],
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: {
              loader: 'ts-loader',
              options: {
                configFile: '../tsconfig.prod.json'
              },
            },
            exclude: /node_modules/,
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
      resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
      },
      output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
      },
      plugins: [new HtmlWebpackPlugin()],
    };
  }