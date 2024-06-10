module.exports = {
    mode: 'development',
    entry: ['./src/index.js'],
    output: {
        filename: './bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    }
};