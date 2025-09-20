# InnovateMart Project Bedrock - EKS Deployment

This repository contains the Infrastructure as Code (IaC) for deploying InnovateMart's retail store application on Amazon EKS.

## Architecture

- **VPC**: Multi-AZ VPC with public and private subnets
- **EKS**: Managed Kubernetes cluster with managed node groups
- **Databases**: RDS PostgreSQL, RDS MySQL, and DynamoDB
- **Networking**: AWS Load Balancer Controller with ALB Ingress
- **Security**: IAM roles with least privilege, read-only developer access

## Prerequisites

- AWS CLI configured with appropriate permissions
- Terraform 1.0+
- kubectl
- Helm (for Load Balancer Controller)

## Deployment Steps

1. **Clone the repository**
2. **Initialize Terraform**: `cd infrastructure/environments/prod && terraform init`
3. **Plan deployment**: `terraform plan -out=tfplan`
4. **Apply infrastructure**: `terraform apply tfplan`
5. **Configure kubectl**: Run `../scripts/setup-kubectl.sh`
6. **Deploy Load Balancer Controller**: Run `../scripts/deploy-lb-controller.sh`
7. **Deploy application**: Run `../scripts/deploy-application.sh`

## CI/CD

GitHub Actions workflow automates Terraform plan/apply on push to main branch.

## Important Notes

- Replace placeholder values in terraform.tfvars
- Secure your database credentials
- Update ACM certificate ARN in ingress manifest
- Configure your domain in Route53
