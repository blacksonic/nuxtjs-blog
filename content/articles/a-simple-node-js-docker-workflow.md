---
title: A simple Node.js Docker workflow
published_at: 2020-01-28
description: Docker is a great tool that helps developers build, deploy, and run applications more efficiently in a standardized way. We can develop in the same environment as the app running in production.
tags: docker, node, javascript, devops
cover_image: a-simple-node-js-docker-workflow/header.png
canonical_url: https://sonicoder.com/blog/a-simple-node-js-docker-workflow
---

Docker is a great tool that helps developers build, deploy, and run applications more efficiently in a standardized way. We can develop in the same environment as the app running in production. You can speed up the debugging or even the prevention of upcoming bugs by having the same setup locally. In the [previous post](https://dev.to/vuesomedev/frontend-development-with-docker-simplified-254i), I've written about a simplified way to use Docker for frontend development, and now I'll show the same for Node.js projects.

### The application

As an example, I've put together a basic application and tried to keep it as simple as it can be. If you like experimenting on your own, you can [clone the repository](https://github.com/vuesomedev/node-docker-workflow) and start making modifications and see how it does.

```javascript
// src/index.js
'use strict'
const express = require('express')
const port = process.env.PORT || 3000
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`App listening on port ${port}!`))
```

The application consists of a single file that spins up a web server and responds to requests. I've used the well-known [Express web framework](https://expressjs.com/) to respond to requests and made the port configurable through an environment variable. We need it to be configurable because this port can alter from the one used in development.

### Development

For development, we would like to have

- the same environment as in production
- set up the environment easily
- see file changes automatically in the browser
- use code completion in the editor

To accomplish all the requirements, we will be using Docker with Docker Compose to create an identical container for both development and production and the [Nodemon package](https://nodemon.io/) to restart the application on file changes.

We can restart on file changes by changing the startup script from `node src/index.js` to `nodemon --watch src src/index.js`. It does the same as before with the addition of restarting it whenever a file changes inside the `src` folder.

Let's get to the more exciting part where we spin up the container locally.

```yaml
# docker-compose.yml
version: '3'

services:
  server:
    image: node:12
    working_dir: /app
    volumes:
      - ./:/app
    ports:
      - 3000:3000
    environment:
      - PORT=3000
    command: sh -c "npm install && npm run dev"
```

The first thing you may notice is that the Docker Compose configuration file doesn't contain a custom Docker image. In most cases, we don't need it, but if it's necessary, we can always add it with the `build` property. In our setup, we'll use the Node base image.

Instead of copying the files in a Dockerfile, I've chosen the two-way synchronization of files with `volumes`. It's more resource-hungry than copying the files, but the fact that installed NPM packages appear on the host machine that makes code-completion available promotes it as a no-brainer.

We shouldn't take things for granted: we set the configurable environment variables. In our case, the port is configurable, where the server listens for incoming calls. Setting it in the config makes it more readable as it is next to the `ports` definition: the place where we declare which internal container ports we would like to see as exposed on the host machine.

The last step is to start the application with the `command` property. We always run the `npm install` command, which can affect startup performance a bit, but also ensures that the dependencies are still up-to-date when the container is running. You can remove it from the `command`, but this way, you have to manually run it before starting the container or when the contents of the `package.json` file changes.

### Production

We can happily develop the application with the previous setup, but we also have to create a deployable container to production. At this point, it's not possible to further postpone the creation of a custom docker image. Let's see how it can be an optimal one.

```docker
# Dockerfile
FROM node:12 AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:12-alpine
WORKDIR /app
COPY --from=base /app .
COPY . .

EXPOSE 3000

CMD npm start
```

The file starts with declaring the starting image, which is called 'base'. Naming it is not necessary, but clarifies a lot when using Dockers [multi-stage build](https://docs.docker.com/develop/develop-images/multistage-build/).

We have to copy only the package files as they are necessary for installing the same versions used for development. The command `npm install` is changed to `npm ci --only=production`. It has two main differences. `npm ci` installs the same versions defined in the lock file and doesn't try to update them as `npm install` does. The second one is the `--only=production` flag that skips the installation of `devDependencies`, which we don't need in production.

We've saved much precious space from the image by skipping `devDependencies`, but the image is still significant (circa 500 MB). Node has a much smaller image called alpine, which only contains packages necessary packages: and fewer packages mean less disk space, memory, better speed, and security. Package installs sometimes require the standard image, but with Docker multi-stage builds, we can switch to the smaller image after the package install and copy the packages from the previous step. This way, we get the best of both worlds: small image size and the ability to install anything.

If we look at the size of the image with `docker images`, we can see that it has shrunk under 100 MB. The image is ready; we can deploy it to production.

### Summary

At first, I didn't feel why I should complicate my everyday life with another technology necessary for development. Others had to show me that with synchronized folders with `volumes` I won't be able to tell the difference between developing on my local machine. After this and the fact that I can test against the same infrastructure on my local computer, they have convinced me to use Docker daily. I hope the above workflow helps others also to get to love Docker for its benefits.
