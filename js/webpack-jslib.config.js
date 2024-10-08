  const path = require('path');
  if (process.env.NODE_ENV !== 'production') {
    module.exports = {
      mode: 'development',
      entry: [
        './src/indexJsLib.ts',
      ],
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: {
              loader: 'ts-loader',
              options: {
                configFile: '../tsconfig.json'
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
        filename: 'main-jslib.js',
        path: path.resolve(__dirname, 'dist'),
      },
    };
  } else {
    module.exports = {
      mode: 'production',
      entry: './src/indexJsLib.ts',
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
        filename: 'main-jslib.js',
        path: path.resolve(__dirname, 'dist'),
      },
    };
  }