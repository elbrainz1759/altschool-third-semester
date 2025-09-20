terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "cluster_name" {
  type    = string
  default = "innovate-mart-eks"
}

variable "cluster_version" {
  type    = string
  default = "1.28"
}

variable "vpc_id" {}
variable "private_subnet_ids" {}
variable "eks_cluster_role_arn" {}
variable "eks_node_role_arn" {}

resource "aws_eks_cluster" "cluster" {
  name     = var.cluster_name
  version  = var.cluster_version
  role_arn = var.eks_cluster_role_arn

  vpc_config {
    subnet_ids = var.private_subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  depends_on = [
    aws_cloudwatch_log_group.eks_cluster
  ]
}

resource "aws_cloudwatch_log_group" "eks_cluster" {
  name              = "/aws/eks/${var.cluster_name}/cluster"
  retention_in_days = 7
}

resource "aws_eks_node_group" "node_group" {
  cluster_name    = aws_eks_cluster.cluster.name
  node_group_name = "managed-node-group"
  node_role_arn   = var.eks_node_role_arn
  subnet_ids      = var.private_subnet_ids

  scaling_config {
    desired_size = 2
    max_size     = 5
    min_size     = 1
  }

  instance_types = ["t3.medium"]

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_eks_cluster.cluster
  ]
}

output "cluster_id" {
  value = aws_eks_cluster.cluster.id
}

output "cluster_endpoint" {
  value = aws_eks_cluster.cluster.endpoint
}

output "cluster_certificate_authority_data" {
  value = aws_eks_cluster.cluster.certificate_authority_data
}

output "cluster_oidc_issuer_url" {
  value = aws_eks_cluster.cluster.identity[0].oidc[0].issuer
}
