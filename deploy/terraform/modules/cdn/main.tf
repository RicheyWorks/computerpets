variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "price_class" {
  type = string
}

locals {
  name   = "${var.project_name}-${var.environment}-bundles"
  # CDN stub always provisions storage + distribution shapes (no VPC required).
  # Keepers still must own a real AWS account to apply.
  prefix = "${var.project_name}-${var.environment}"
}

resource "aws_s3_bucket" "bundles" {
  bucket_prefix = "${local.prefix}-bundles-"

  tags = {
    Name = local.name
  }
}

resource "aws_s3_bucket_public_access_block" "bundles" {
  bucket = aws_s3_bucket.bundles.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "bundles" {
  bucket = aws_s3_bucket.bundles.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "bundles" {
  bucket = aws_s3_bucket.bundles.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_cloudfront_origin_access_control" "bundles" {
  name                              = local.name
  description                       = "OAC for ComputerPets pet bundle bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "bundles" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "ComputerPets pet bundle CDN. Edge redeem ADR 0063. API WAF is the ALB (ADR 0074)."
  price_class         = var.price_class
  default_root_object = ""

  origin {
    domain_name              = aws_s3_bucket.bundles.bucket_regional_domain_name
    origin_id                = "bundles-s3"
    origin_access_control_id = aws_cloudfront_origin_access_control.bundles.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "bundles-s3"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = true # owner, jti, exp, sig ride the signed URL
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = local.name
  }
}

# Bucket policy: CloudFront OAC only — no public GetObject.
data "aws_iam_policy_document" "bundles" {
  statement {
    sid     = "AllowCloudFrontOACRead"
    actions = ["s3:GetObject"]
    resources = [
      "${aws_s3_bucket.bundles.arn}/*",
    ]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.bundles.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "bundles" {
  bucket = aws_s3_bucket.bundles.id
  policy = data.aws_iam_policy_document.bundles.json
}

output "bucket_name" {
  value = aws_s3_bucket.bundles.id
}

output "distribution_domain" {
  description = "CloudFront domain — set BUNDLE_BASE_URL=https://<domain>/bundles"
  value       = aws_cloudfront_distribution.bundles.domain_name
}

output "bundle_base_url" {
  description = "Suggested BUNDLE_BASE_URL for the house ConfigMap / Secret."
  value       = "https://${aws_cloudfront_distribution.bundles.domain_name}/bundles"
}

output "distribution_id" {
  value = aws_cloudfront_distribution.bundles.id
}
