# ember-storm
Ember multiapp hosting for https://github.com/ember-cli/ember-cli-deploy

Fork of https://github.com/philipheinser/ember-lightning, which only supports 1 app per server instance.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/dough-com/ember-storm)

# Docker support

ember-storm is also available as a docker container. To build the container run:

```shell
docker build --tag ember-storm .
```

Then, to serve an ember-cli application run the container:

```shell
docker run --name ember-storm --env REDIS_HOST=your-redis-server.example.com ember-storm:latest
```

The image responds to these environment variables:

### `REDIS_HOST`

The hostname of the Redis server where ember-cli applications are deployed.
This default to `redis` and so it is also possible to use Docker container
links to connect the ember-storm container to a running Redis container.

### `REDIS_PORT`

The port that Redis is listening on. Defaults to 6379. This only needs to be
set if Redis is listening on a non-default port.

### `REDIS_SECRET`

The shared secret to use for authenticating to Redis. It is blank by default,
which disables authentication.
