While in the main folder:
> node

> require('./spec').then(function(context){logger = context.logger}).otherwise(function(er){err = er})

> logger.info('test info log message body')
