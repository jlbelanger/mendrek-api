#!/bin/bash
set -e

source ./deploy-config.sh

BRANCH="master"

# Ensure we're deploying from the correct branch.
CURRENT_BRANCH=$(git branch | grep \* | cut -d ' ' -f2)
if [[ "$CURRENT_BRANCH" != "$BRANCH" ]]; then
  printf "ERROR: This is not the $BRANCH branch.\n"
  exit
fi

# Show a warning if there are local changes.
HAS_CHANGES=$(git status --porcelain)
if [[ -n "$HAS_CHANGES" ]]; then
  echo -n "There are local changes. Enter [y] to continue anyway: "
  read CMD
  if [[ "$CMD" != "y" ]]; then
    printf "ERROR: Cancelled.\n"
    exit
  fi
fi

printf "\n\nPulling...\n"
ssh "$DEPLOY_HOST" "cd $DEPLOY_FOLDER; git pull"

printf "\n\nUpdating packages...\n"
ssh "$DEPLOY_HOST" "cd $DEPLOY_FOLDER; yarn install"

printf "\n\nRestarting...\n"
ssh "$DEPLOY_HOST" "pm2 restart $APP_NAME"
