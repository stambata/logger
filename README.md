From the main folder:
> node
> require('./spec').then(function(p){logger = p.logger}).otherwise(function(p){err = p})
> logger.info('test info log message body')