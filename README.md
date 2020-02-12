# Mendrek API

## Demo

View the app at https://mendrek.jennybelanger.com/

## Development setup

### Install requirements

* [Docker](https://www.docker.com/get-started)
* [npm](https://www.npmjs.com/get-npm)

### Create a Spotify app

Create a Spotify application: https://developer.spotify.com/dashboard/applications

Add `http://localhost:5309/authenticate/callback` as a whitelisted Redirect URI.

### Clone the API repo

```
git clone https://github.com/jlbelanger/mendrek-api.git
cd mendrek-api
```

All other commands should be run in the `mendrek-api` folder.

### Configure environment settings

```
cp .env.example .env
```

Copy the Client ID and Client Secret from your Spotify application into `.env`.

### Install dependencies

```
npm install
```

### Start the API

```
docker-compose up --build
```

Once you see the output `Listening on http://localhost:5309` from the web container and `mysqld: ready for connections` from the db container, it should be ready.

To check if it's working, go to http://localhost:5309/. You should see `{"success": true}`.

### Run database migrations

In a new window:

```
docker exec -i -t mendrek /bin/bash -c 'knex migrate:latest'
```

### Setup the app

See [Mendrek app](https://github.com/jlbelanger/mendrek-app).

## Deploying

### First-time setup

Locally, run:

```
cp deploy-config.sh.example deploy-config.sh
```

Set the variables in `deploy-config.sh`.

On the server, you will need to set up the git repo in DEPLOY_FOLDER, then copy `.env.example` to `.env` and set the variables there. Then run:

```
npm install -g pm2
pm2 start npm --name "APP_NAME" -- start # where APP_NAME matches the value in deploy-config.sh
```

### Subsequent deploys

```
./deploy.sh
```

## Helpful development stuff

### Connecting to the database

* **Host**: 0.0.0.0
* **Username**: root
* **Password**: root
* **Database**: mendrek

### Running tests

```
docker exec -i -t mendrek /bin/bash -c 'npm test'
```
