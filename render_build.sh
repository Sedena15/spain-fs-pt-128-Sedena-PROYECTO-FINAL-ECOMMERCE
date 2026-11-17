#!/usr/bin/env bash
# exit on error
set -o errexit

npm ci
npm run build
pip install pipenv
pipenv sync

pipenv run upgrade
