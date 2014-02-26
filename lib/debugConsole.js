(function(define) {define(function(require){

    var logio;

    var logHost;
    var logPort;
    var webHost;
    var webPort;

    var logServer;
    var webServer;

    function BrowserConsole(dependencies) {
        logio = dependencies.logio;
    }

    BrowserConsole.prototype.init = function BrowserConsole__init(config) {
        logHost = config.logHost;
        logPort = config.logPort;
        webHost = config.webHost;
        webPort = config.webPort;

        logServer = new logio.LogServer({host: logHost, port: logPort});
        webServer = new logio.WebServer(logServer, {host: webHost, port: webPort});
    };

    BrowserConsole.prototype.ready = function BrowserConsole__ready() {
        webServer.run();
    };

    return BrowserConsole;

});})(typeof define === 'function' && define.amd ?  define : function(factory){ module.exports = factory(require); });