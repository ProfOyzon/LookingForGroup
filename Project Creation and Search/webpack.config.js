const path = require('path');

module.exports = {
  entry: {
    //db: './src/db.js',
    main: './src/main.js',
    profile_creation: './src/profile_creation.js',
    project_creation: './src/project_creation.js',
    project_creation_react: './src/project_creation_react.jsx',
  },
  module: {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
            },
        },
    ],
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name]_bundle.js'
  }
}