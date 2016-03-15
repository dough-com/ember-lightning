'use strict';

var redis = require('redis'),
    coRedis = require('co-redis'),
    koa = require('koa');

var app = koa(),
    client  = redis.createClient(
      process.env.REDIS_PORT,
      process.env.REDIS_HOST
    ),
    dbCo = coRedis(client);

if (process.env.REDIS_SECRET) {
  client.auth(process.env.REDIS_SECRET);
}

client.on('error', function (err) {
  console.log('Redis client error: ' + err);
});

var START_TIME = new Date();

app.use(function* (next) {
  if (/^\/health(\.json)?$/.test(this.request.path)) {
    this.status = 200;
    this.type = 'application/json';
    this.body = JSON.stringify({
      'application-name': 'ember-storm',
      'application-started-at': START_TIME,
      'application-up-time': (Date.now() - START_TIME) / 1000
    });
  } else {
    yield next;
  }
});

app.use(function* () {
  var pathComponents = this.request.path.split('/');
  var appName = pathComponents[1];

  var indexKey = this.request.query.index_key || 'current-content'
  var indexHtml = yield dbCo.get(appName + ':' + indexKey);

  if (indexHtml) {
    this.body = indexHtml;
  } else {
    this.status = 404;
  }
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('ember-storm started on port ' + PORT);
});
