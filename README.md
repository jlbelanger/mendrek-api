# Mendrek API

## Demo

View the app at https://mendrek.jennybelanger.com/

## Development setup

### Install requirements

- [Docker](https://www.docker.com/get-started)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

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

## Deployment

Essentially, to set up the repo on the server:

``` bash
git clone https://github.com/jlbelanger/mendrek-api.git
cd mendrek-api
cp .env.example .env
# Then configure the values in .env.
yarn install
yarn global add pm2@4.4.0
pm2 start start.js --name mendrek-api
```

For subsequent deploys, push changes to master, then run the following on the server:

``` bash
cd mendrek-api
git fetch origin
git pull
yarn install
pm2 restart mendrek-api
```

### Deploy script

Note: The deploy script included in this repo depends on other scripts that only exist in my private repos. If you want to deploy this repo, you'll have to create your own script.

``` bash
./deploy.sh
```

## Helpful development stuff

### Connecting to the database

- **Host**: 0.0.0.0
- **Username**: mendrek
- **Password**: mendrek
- **Database**: mendrek

### Running tests

``` bash
docker exec -it mendrek sh -c 'yarn test'
```
