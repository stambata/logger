(function(define) {define(function(require){
        // private variables
        var winston = null;
        var winstonLogIO = null;
        var winstonCouchDB = null;
        var loggers = null;
        var dynamicLogsPath;

        // core node module requires
        var EventEmitter = require('events').EventEmitter;
        var util = require('util');

        // constructor
        // make child of EventEmitter
        function Logger(dependencies) {
            EventEmitter.call(this);

            winston = dependencies.winston;
            winstonLogIO = dependencies.winstonLogIO;
            winstonCouchDB = dependencies.winstonCouchDB;
            loggers = new winston.Container();
        }
        util.inherits(Logger, EventEmitter);

        // init
        Logger.prototype.init = function Logger__init(config) {
            this.loggers = {
                'main'  : loggers.add('main', config.main),
                'logio' : loggers.add('logio', config.logio).remove(winston.transports.Console)
            };
            dynamicLogsPath = config.dynamicLogsPath || '../logs';
        };
        // ready
        Logger.prototype.ready = function Logger__ready() {
            // not implemented
        };

        // add logger
        Logger.prototype.addLogger = function Logger__addLogger(loggerName) {
            this.loggers[loggerName] = loggers.add(loggerName, { // set to 'silly' so that all levels could be logged (for testing purposes)
                file: {
                    filename: dynamicLogsPath + '/' + loggerName + '.log',
                    level: 'silly'
                }
            }).remove(winston.transports.Console)
        };

        // ---------------------
        // logging methods below (should actually be the only ones that get called from outside)
        // ---------------------
        Logger.prototype.silly = function Logger__silly() {
            this.logHandler('silly', arguments);
        };

        Logger.prototype.debug = function Logger__debug() {
            this.logHandler('debug', arguments);
        };

        Logger.prototype.verbose = function Logger__verbose() {
            this.logHandler('verbose', arguments);
        };

        Logger.prototype.info = function Logger__info() {
            this.logHandler('info', arguments);
        };

        Logger.prototype.warn = function Logger__warn() {
            this.logHandler('warn', arguments);
        };

        Logger.prototype.error = function Logger__error() {
            this.logHandler('error', arguments);
        };

        // ---------------------
        // logging methods above
        // ---------------------

        Logger.prototype.logHandler = function Logger__logHandler(level, data) {
            data = Array.prototype.slice.call(data, 0);
            if (util.isArray(data[0])){
                var loggers = data.shift();
                var loggerName;
                for(var i = 0, n = loggers.length; i < n; i += 1) {
                    loggerName = loggers[i];
                    if(!this.loggers[loggerName])
                        this.addLogger(loggerName);
                    this.loggers[loggerName][level].apply(this.loggers[loggerName], data);
                }
            } else {
                this.loggers['main'][level].apply(this.loggers['main'], data);
            }

            // always emit a socket message to log.io log server
            // send just once no matter if one or multiple other loggers have logged it.
            this.loggers['logio'][level].apply(this.loggers['logio'], data);
        };

        // query testing
        Logger.prototype.query = function Logger__query(options, cb) {
            if (!options) {
                // dummy options
                options = {
                    from: new Date - 24 * 60 * 60 * 1000, // 1 day back
                    until: new Date,
                    limit: 10,
                    start: 0,
                    order: 'desc',
                    fields: ['message', 'timestamp']
                }
            }
            this.loggers['main'].query(options,  function (err, results) {
                if (err)
                  throw err;
                if (cb)
                    cb(results);
            });

        };

        return Logger;
});})(typeof define === 'function' && define.amd ?  define : function(factory){ module.exports = factory(require); });