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

app.use(function* () {

  var pathComponents;
  var appName;
  var indexkey;

  pathComponents = this.request.path.split('/');
  if (pathComponents < 2) {
    appName = process.env.APP_NAME;
  } else {
    appName = pathComponents[1];
  }

  if (this.request.query.index_key) {
    indexkey = appName +':'+ this.request.query.index_key;
  } else {
    var identifier = yield dbCo.get(appName +':current');
    indexkey = appName + ':' + identifier;
  }
  var index = yield dbCo.get(indexkey);

  if (index) {
    this.body = index;
  } else {
    this.status = 404;
  }
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('ember-storm started on port ' + PORT);
});
