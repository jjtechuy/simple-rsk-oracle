module.exports = {
    lint: {
        files: ['src/**/*', 'test/**/*']
    },
    depCheck: {
        ignore: [
            '@types/*', 'tasegir',  '@oclif/*', 'reflect-metadata', 'cross-env'
        ]
    }
}
