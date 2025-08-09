terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.region
}

resource "aws_vpc" "cloudlaunch" {
  cidr_block = "10.0.0.0/16"
  instance_tenancy = "default"
  tags = {
    Name = "cloudlaunch-vpc"
  }
}

# Subnets
resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.cloudlaunch.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true
  tags = { Name = "cloudlaunch-public-subnet" }
}

resource "aws_subnet" "app" {
  vpc_id            = aws_vpc.cloudlaunch.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = false
  tags = { Name = "cloudlaunch-app-subnet" }
}

resource "aws_subnet" "db" {
  vpc_id            = aws_vpc.cloudlaunch.id
  cidr_block        = "10.0.3.0/28"
  availability_zone = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = false
  tags = { Name = "cloudlaunch-db-subnet" }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.cloudlaunch.id
  tags = { Name = "cloudlaunch-igw" }
}

# Route tables
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.cloudlaunch.id
  tags = { Name = "cloudlaunch-public-rt" }
}

resource "aws_route" "public_default_route" {
  route_table_id         = aws_route_table.public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}

# Private route tables (no 0.0.0.0/0)
resource "aws_route_table" "app_rt" {
  vpc_id = aws_vpc.cloudlaunch.id
  tags = { Name = "cloudlaunch-app-rt" }
}

resource "aws_route_table_association" "app_assoc" {
  subnet_id      = aws_subnet.app.id
  route_table_id = aws_route_table.app_rt.id
}

resource "aws_route_table" "db_rt" {
  vpc_id = aws_vpc.cloudlaunch.id
  tags = { Name = "cloudlaunch-db-rt" }
}

resource "aws_route_table_association" "db_assoc" {
  subnet_id      = aws_subnet.db.id
  route_table_id = aws_route_table.db_rt.id
}

# Security groups
resource "aws_security_group" "app_sg" {
  name        = "cloudlaunch-app-sg"
  description = "Allow HTTP (80) within VPC only"
  vpc_id      = aws_vpc.cloudlaunch.id
  tags = { Name = "cloudlaunch-app-sg" }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.cloudlaunch.cidr_block] # allow from inside VPC
    description = "HTTP from inside VPC"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound (for control plane/API access)"
  }
}

resource "aws_security_group" "db_sg" {
  name        = "cloudlaunch-db-sg"
  description = "Allow MySQL (3306) from app subnet only"
  vpc_id      = aws_vpc.cloudlaunch.id
  tags = { Name = "cloudlaunch-db-sg" }

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["10.0.2.0/24"] # app subnet only
    description = "MySQL from app subnet"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Data: AZs
data "aws_availability_zones" "available" {
  state = "available"
}

# Outputs (useful for README)
output "vpc_id" {
  value = aws_vpc.cloudlaunch.id
}
output "public_subnet_id" { value = aws_subnet.public.id }
output "app_subnet_id"    { value = aws_subnet.app.id }
output "db_subnet_id"     { value = aws_subnet.db.id }
output "igw_id"           { value = aws_internet_gateway.igw.id }
output "app_sg_id"        { value = aws_security_group.app_sg.id }
output "db_sg_id"         { value = aws_security_group.db_sg.id }
