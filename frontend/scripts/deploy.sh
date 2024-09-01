#!/bin/sh

set -e

BUILD=${BUILD:-true}
IMAGE_REPO=${IMAGE_REPO:-localhost:5000}
IMAGE_TAG=${IMAGE_TAG:-latest}
WAIT=${WAIT:-false}
SCRIPT_DIR=$(dirname "$0")

# build
if [ "$BUILD" = true ]; then
  echo "Building the frontend"
  "$SCRIPT_DIR/build.sh"
fi

# deploy
helm upgrade --install frontend "$SCRIPT_DIR/../chart" --set image.repository="$IMAGE_REPO/frontend" --set image.tag="$IMAGE_TAG" -f "${SCRIPT_DIR}/../.values.yaml" --wait="$WAIT"