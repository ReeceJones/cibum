#!/bin/sh

docker build . -t localhost:5000/backend:latest --target=app --push