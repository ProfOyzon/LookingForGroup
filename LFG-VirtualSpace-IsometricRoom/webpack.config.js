module.exports = {
    mode: 'development',
    entry: ['./src/main.js'],
    output: {
      filename: './bundle.js'
    },
    resolve: {
      extensions: ['.ts', '.js'],
    }
  };