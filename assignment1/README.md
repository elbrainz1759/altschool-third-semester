# AltSchool CloudLaunch — Semester 3 Assignment 1 (Cloud)

## Overview
This repository contains the infrastructure as code and instructions for **Task 1 (S3 static site)** and **Task 2 (VPC Design)** of the CloudLaunch assignment.

### What I implemented
- **Task 1 (S3):**
  - Hosted a static site on S3 (public-read index.html)
  - S3 website link: `https://<your-bucket-name>.s3-website-<region>.amazonaws.com/`  *(replace with your S3 endpoint)*
  - (Optional) CloudFront distribution: `https://<cloudfront-id>.cloudfront.net/` *(if configured)*

- **Task 2 (VPC Design)** — implemented via Terraform:
  - VPC: `cloudlaunch-vpc` — CIDR `10.0.0.0/16`
  - Subnets:
    - Public Subnet: `10.0.1.0/24` (cloudlaunch-public-subnet)
    - Application Subnet: `10.0.2.0/24` (cloudlaunch-app-subnet) — private
    - Database Subnet: `10.0.3.0/28` (cloudlaunch-db-subnet) — private
  - Internet Gateway: `cloudlaunch-igw` attached to `cloudlaunch-vpc`
  - Route tables:
    - `cloudlaunch-public-rt` associated with public subnet and default route `0.0.0.0/0` -> IGW
    - `cloudlaunch-app-rt` associated with app subnet, **no** route to internet (private)
    - `cloudlaunch-db-rt` associated with db subnet, **no** route to internet (private)
  - Security Groups:
    - `cloudlaunch-app-sg`: allows TCP/80 from inside VPC only (`10.0.0.0/16`)
    - `cloudlaunch-db-sg`: allows TCP/3306 from app subnet only (`10.0.2.0/24`)
  - IAM:
    - `cloudlaunch-user` created with read-only IAM policy for VPC resources (policy file: `iam/cloudlaunch-vpc-readonly-policy.json`)
    - The user is set with `password_reset_required` on first login.

## Files in this repository
- `terraform/main.tf` — Terraform code for VPC, subnets, IGW, route tables, SGs
- `terraform/variables.tf` — Terraform variables
- `iam/cloudlaunch-vpc-readonly-policy.json` — IAM policy to attach to `cloudlaunch-user`
- `README.md` — this file

## How to deploy (Terraform)
```bash
cd terraform
terraform init
terraform plan
terraform apply
