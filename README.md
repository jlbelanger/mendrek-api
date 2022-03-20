# Mendrek API

View the app at https://mendrek.jennybelanger.com/

## Development

### Requirements

- [Docker](https://www.docker.com/get-started)
	- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- [Git](https://git-scm.com/)

### Setup

First, [create a Spotify application](https://developer.spotify.com/dashboard/applications). Add `http://localhost:5309/authenticate/callback` as a whitelisted Redirect URI.

``` bash
# Clone the API repo
git clone https://github.com/jlbelanger/mendrek-api.git
cd mendrek-api

# Configure the environment settings
cp .env.example .env
# Copy the Client ID and Client Secret from your Spotify application into .env

# Start the API
docker-compose up --build

# Once you see the output `Listening on http://localhost:5309` from the web container and `mysqld: ready for connections` from the db container, it should be ready.

# To check if it's working, go to http://localhost:5309/. You should see `{"success": true}`.

# In a new window:
# Run the database migrations
docker exec -it mendrek sh -c 'knex migrate:latest'
```

Then, setup the [Mendrek app](https://github.com/jlbelanger/mendrek-app).

### Lint

``` bash
docker exec -it mendrek sh -c 'yarn lint'
```

### Test

``` bash
docker exec -it mendrek sh -c 'yarn test'
```

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

For subsequent deploys, push changes to the main branch, then run the following on the server:

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
