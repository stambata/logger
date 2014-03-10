module.exports = require('wire')({
    // #############################
    // browser console
    // #############################
    logio: {
        module : 'log.io'
    },
    debugConsole : {
        create : {
            module : './debugConsole',
            args : { // dependencies
                logio : {$ref : 'logio'}
            }
        },
        init : {
            'init': { // config
                logHost : '127.0.0.1',
                logPort : 28777,
                webHost : '127.0.0.1',
                webPort : 28778
            }
        },
        ready : 'ready'
    },
    
    // #############################
    // logger
    // #############################
    winston : {
        module : 'winston'
    },
    winstonCouchDB: {
        module : 'winston-couchdb'
    },
    winstonLogIO: {
        module : 'winston-logio'
    },
    logger : {
        create : {
            module : './logger',
            args : { // dependencies
                winston : {$ref : 'winston'},
                winstonLogIO : {$ref : 'winstonLogIO'},
                winstonCouchDB : {$ref : 'winstonCouchDB'}
            }
        },
        init : {
            'init': { // dependencies
                'main' : { // main logger transports
                    file: {
                        filename: '../logs/all.log',
                        level: 'silly'
                    },
                    console: {
                        colorize: 'true',
                        level: 'silly'
                    },
                    Couchdb: {
                        db: 'winston',
                        host: '127.0.0.1',
                        port: 5984,
                        /*auth: {username: 'user', password: 'pass'},
                        secure: false,*/
                        level: 'silly'
                    }
                },
                'logio' : { // log.io transport
                    Logio : { 
                        host: '127.0.0.1',
                        port: 28777,
                        node_name: 'winston_logio_test',
                        silent: false,
                        level: 'silly'
                      }
                },
                'dynamicLogsPath' : '../logs'
            }
        }
    }
}, {require : require});