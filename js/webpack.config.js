  const path = require('path');

  if (process.env.NODE_ENV !== 'production') {
    module.exports = {
      mode: 'development',
      entry: './src/index.ts',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
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
    };
  } else {
    module.exports = {
      mode: 'production',
      entry: './src/index.ts',
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
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
    };
  }