#!/bin/sh

colima start \
    -p cibum \
    --activate \
    --foreground \
    --network-address \
    --kubernetes \
    --cpu 2 \
    --memory 2 \
    --k3s-arg "--disable=traefik"
    # --k3s-arg "--disable=servicelb"  # I think this is needed, but it conflicts port 80 with the ingress gateway


