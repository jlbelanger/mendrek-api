# Mendrek API

## Demo

View the app at https://mendrek.jennybelanger.com/

## Development setup

### Install requirements

* [Docker](https://www.docker.com/get-started)
* [Yarn](https://classic.yarnpkg.com/en/docs/install)

### Create a Spotify app

Create a Spotify application: https://developer.spotify.com/dashboard/applications

Add `http://localhost:5309/authenticate/callback` as a whitelisted Redirect URI.

### Clone the API repo

``` bash
git clone https://github.com/jlbelanger/mendrek-api.git
cd mendrek-api
```

All other commands should be run in the `mendrek-api` folder.

### Configure environment settings

``` bash
cp .env.example .env
```

Copy the Client ID and Client Secret from your Spotify application into `docker-compose.yml`.

### Install dependencies

``` bash
yarn install
```

### Start the API

``` bash
docker-compose up --build
```

Once you see the output `Listening on http://localhost:5309` from the web container and `mysqld: ready for connections` from the db container, it should be ready.

To check if it's working, go to http://localhost:5309/. You should see `{"success": true}`.

### Run database migrations

In a new window:

``` bash
docker exec -it mendrek sh -c 'knex migrate:latest'
```

### Setup the app

See [Mendrek app](https://github.com/jlbelanger/mendrek-app).

## Deploying

### First-time setup

Locally, run:

``` bash
cp deploy-config.sh.example deploy-config.sh
```

Set the variables in `deploy-config.sh`.

On the server, you will need to set up the git repo in DEPLOY_FOLDER, then copy `.env.example` to `.env` and set the variables there. Then run:

``` bash
yarn global add pm2@3.5.1
pm2 start yarn --name "APP_NAME" -- start # where APP_NAME matches the value in deploy-config.sh
```

### Subsequent deploys

``` bash
./deploy.sh
```

## Helpful development stuff

### Connecting to the database

* **Host**: 0.0.0.0
* **Username**: mendrek
* **Password**: mendrek
* **Database**: mendrek

### Running tests

``` bash
docker exec -it mendrek sh -c 'yarn test'
```
