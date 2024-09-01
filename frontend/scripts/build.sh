#!/bin/sh

set -e

IMAGE_REPO=${IMAGE_REPO:-localhost:5000}
IMAGE_TAG=${IMAGE_TAG:-latest}
SCRIPT_DIR=$(dirname "$0")

docker build "${SCRIPT_DIR}/.." -t "${IMAGE_REPO}/frontend:${IMAGE_TAG}" --target=app --push