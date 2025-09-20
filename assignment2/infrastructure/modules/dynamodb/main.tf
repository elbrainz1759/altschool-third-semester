terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_dynamodb_table" "carts" {
  name         = "carts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "innovate-mart-carts-table"
  }
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.carts.name
}
