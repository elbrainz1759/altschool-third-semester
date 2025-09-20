terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "innovate-mart-tf-state-prod"
    key    = "eks-cluster/terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  region = "us-west-2"
}

data "aws_caller_identity" "current" {}

module "vpc" {
  source = "../../modules/vpc"

  vpc_name = "innovate-mart-prod-vpc"
  vpc_cidr = "10.0.0.0/16"
  azs      = ["us-west-2a", "us-west-2b", "us-west-2c"]
}

module "iam" {
  source = "../../modules/iam"

  cluster_name = "innovate-mart-eks-prod"
}

module "eks" {
  source = "../../modules/eks"

  cluster_name          = "innovate-mart-eks-prod"
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  eks_cluster_role_arn  = module.iam.eks_cluster_role_arn
  eks_node_role_arn     = module.iam.eks_node_role_arn
}

module "rds" {
  source = "../../modules/rds"

  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  db_username        = var.db_username
  db_password        = var.db_password
}

module "dynamodb" {
  source = "../../modules/dynamodb"
}
