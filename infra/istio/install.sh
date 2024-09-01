#!/bin/sh

set -e

SYSTEM_NAMESPACE=${SYSTEM_NAMESPACE:-istio-system}
TIMEOUT=${TIMEOUT:-30m}

kubectl get crd gateways.gateway.networking.k8s.io &> /dev/null || \
  { kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.1.0/standard-install.yaml; }

helm repo add istio https://istio-release.storage.googleapis.com/charts
helm repo update

echo "Installing Istio base"
helm upgrade --install istio-base istio/base \
  --namespace "$SYSTEM_NAMESPACE" \
  --create-namespace \
  --timeout "$TIMEOUT" \
  --wait

echo "Installing Istio control plane"
helm upgrade --install istiod istio/istiod \
  --set profile=ambient \
  --set pilot.resources.requests.cpu=250m \
  --set pilot.resources.requests.memory=512Mi \
  --namespace "$SYSTEM_NAMESPACE" \
  --timeout "$TIMEOUT" \
  --wait

echo "Installing Istio CNI agent"
helm upgrade --install istio-cni istio/cni \
  --namespace "$SYSTEM_NAMESPACE" \
  --set profile=ambient \
  --timeout "$TIMEOUT" \
  --wait

echo "Installing Istio ztunnel daemonset"
helm upgrade --install ztunnel istio/ztunnel \
  --set resources.requests.cpu=100m \
  --set resources.requests.memory=128Mi \
  --namespace "$SYSTEM_NAMESPACE" \
  --timeout "$TIMEOUT" \
  --wait
