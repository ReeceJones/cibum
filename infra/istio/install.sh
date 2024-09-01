#!/bin/sh

set -e

SYSTEM_NAMESPACE=istio-system
# INGRESS_NAMESPACE=istio-ingress

kubectl get crd gateways.gateway.networking.k8s.io &> /dev/null || \
  { kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.1.0/standard-install.yaml; }

helm repo add istio https://istio-release.storage.googleapis.com/charts
helm repo update

echo "Installing Istio base"
helm upgrade --install istio-base istio/base --namespace "$SYSTEM_NAMESPACE" --create-namespace --wait

echo "Installing Istio control plane"
helm upgrade --install istiod istio/istiod --namespace "$SYSTEM_NAMESPACE" --set profile=ambient --wait

echo "Installing Istio CNI agent"
helm upgrade --install istio-cni istio/cni --namespace "$SYSTEM_NAMESPACE" --set profile=ambient --wait

echo "Installing Istio ztunnel daemonset"
helm upgrade --install ztunnel istio/ztunnel --namespace "$SYSTEM_NAMESPACE" --wait


# echo "Installing Istio ingress gateway"
# # check if ingress namespace already exists
# if kubectl get namespace "$INGRESS_NAMESPACE" &> /dev/null; then
#     echo "Namespace $INGRESS_NAMESPACE already exists"
# else
#     echo "Creating namespace $INGRESS_NAMESPACE"
#     kubectl create namespace "$INGRESS_NAMESPACE"
# fi

# kubectl label namespace "$INGRESS_NAMESPACE" istio-injection=enabled --overwrite
# helm upgrade --install istio-ingressgateway istio/gateway --namespace "$INGRESS_NAMESPACE"


