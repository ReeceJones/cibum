#!/bin/sh

set -e

SCRIPT_DIR=$(dirname "$0")
CHART_DIR="$SCRIPT_DIR/../chart"
CHECK_REQUIRED_ENV_VARS="false"
REQUIRED_ENV_VARS=(
    "POSTGRES_USER"
    "POSTGRES_PASSWORD"
    "POSTGRES_DB"
    "GATEWAY_HOSTNAME"
    "REDIS_PASSWORD"
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

# add bitnami repo
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# update chart dependencies
helm dependency build "$CHART_DIR"
helm dependency update "$CHART_DIR"

# get chart values
envsubst < "$SCRIPT_DIR/.values.template.yaml" > "$SCRIPT_DIR/values.yaml"

# install chart
helm upgrade --install infra "$CHART_DIR" -f "$SCRIPT_DIR/values.yaml" --wait
