terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "vpc_id" {}
variable "private_subnet_ids" {}
variable "db_username" {
  type      = string
  sensitive = true
}
variable "db_password" {
  type      = string
  sensitive = true
}

resource "aws_db_subnet_group" "main" {
  name       = "innovate-mart-rds-subnet-group"
  subnet_ids = var.private_subnet_ids
}

resource "aws_security_group" "rds_sg" {
  name   = "innovate-mart-rds-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "orders_db" {
  identifier             = "innovate-mart-orders-db"
  engine                 = "postgres"
  engine_version         = "15"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  db_name                = "ordersdb"
  username               = var.db_username
  password               = var.db_password
  multi_az               = false
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  skip_final_snapshot    = true
  publicly_accessible    = false
}

resource "aws_db_instance" "catalog_db" {
  identifier             = "innovate-mart-catalog-db"
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  db_name                = "catalogdb"
  username               = var.db_username
  password               = var.db_password
  multi_az               = false
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  skip_final_snapshot    = true
  publicly_accessible    = false
}

output "orders_db_endpoint" {
  value = aws_db_instance.orders_db.endpoint
}

output "catalog_db_endpoint" {
  value = aws_db_instance.catalog_db.endpoint
}
