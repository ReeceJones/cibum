#!/bin/sh

set -e

BUILD=${BUILD:-true}
IMAGE_REPO=${IMAGE_REPO:-localhost:5000}
IMAGE_TAG=${IMAGE_TAG:-latest}
WAIT=${WAIT:-false}
SCRIPT_DIR=$(dirname "$0")
CHECK_REQUIRED_ENV_VARS="false"
REQUIRED_ENV_VARS=(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    "CLERK_SECRET_KEY"
    "NEXT_PUBLIC_API_URL"
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
  echo "Building the frontend"
  "$SCRIPT_DIR/build.sh"
fi

# get chart values
envsubst < "$SCRIPT_DIR/../.values.template.yaml" > "$SCRIPT_DIR/../.values.yaml"

# deploy
helm upgrade --install frontend "$SCRIPT_DIR/../chart" --set image.repository="$IMAGE_REPO/frontend" --set image.tag="$IMAGE_TAG" -f "${SCRIPT_DIR}/../.values.yaml" --wait="$WAIT"