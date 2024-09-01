#!/bin/sh

SCRIPT_DIR=$(dirname "$0")
CHART_DIR="$SCRIPT_DIR/../chart"

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
