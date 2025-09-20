#!/bin/bash
# Script to configure kubectl for EKS cluster

set -e

CLUSTER_NAME="innovate-mart-eks-prod"
REGION="us-west-2"

echo "Setting up kubectl for EKS cluster: $CLUSTER_NAME"

# Update kubeconfig
aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME

# Verify connection
kubectl get nodes

echo "Kubectl configuration completed successfully!"
