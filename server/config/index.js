config = {
    development: {
        PORT: 3000,
        SECRET: 'verySecretSecret',
        DB_URI: 'mongodb://127.0.0.1:27017/furni-shop',
        origin: ['http://localhost:4200']
    },
    production: {
        PORT: 3000,
        SECRET: 'evenMoreSecretSecret',
        DB_URI: 'mongodb+srv://aSipz:WQGlcsJ79fXqmEMj@cluster0.yazycpi.mongodb.net/?retryWrites=true&w=majority',
        origin: ['http://localhost:4200', 'https://furniture-shop-df231.web.app']
    }
};

module.exports = config[process.env.NODE_ENV || 'development'];