#!/bin/bash

set -e

BUILD=${BUILD:-true}
IMAGE_REPO=${IMAGE_REPO:-localhost:5000}
IMAGE_TAG=${IMAGE_TAG:-latest}
WAIT=${WAIT:-false}
SCRIPT_DIR=$(dirname "$0")
CHECK_REQUIRED_ENV_VARS="false"
REQUIRED_ENV_VARS=(
    "CLERK_API_URL"
    "CLERK_SECRET_KEY"
    "FRONTEND_URLS"
    "DB_URI"
    "REDIS_URI"
    "GATEWAY_HOSTNAME"
)

# check required env vars
if [ "$CHECK_REQUIRED_ENV_VARS" = "true" ]; then
    for var in $REQUIRED_ENV_VARS; do
    if [ -z "${!var}" ]; then
        echo "Missing required env var: $var"
        exit 1
    fi
    done
fi

# build
if [ "$BUILD" = true ]; then
  echo "Building the backend"
  "$SCRIPT_DIR/build.sh"
fi

# get chart values
envsubst < "$SCRIPT_DIR/../.values.template.yaml" > "$SCRIPT_DIR/../.values.yaml"

# deploy
helm upgrade --install backend "$SCRIPT_DIR/../chart" --set image.repository="$IMAGE_REPO/backend" --set image.tag="$IMAGE_TAG" -f "${SCRIPT_DIR}/../.values.yaml" --wait="$WAIT"