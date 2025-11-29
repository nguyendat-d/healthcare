#!/bin/bash

set -e

# Configuration - CHỈ 1 REPOSITORY
AWS_ACCOUNT_ID="470201304657"
AWS_REGION="us-east-1"
REPO_NAME="healthcare"
EBS_APP_NAME="healthcare-app"
EBS_ENV_NAME="healthcare-app-prod"

echo "🚀 Starting deployment to AWS EBS..."

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push BACKEND với tag "backend-latest"
echo "📦 Building backend image..."
cd backend
docker build -t backend-image .
docker tag backend-image:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:backend-latest
cd ..

echo "⬆️ Pushing backend image..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:backend-latest

# Build and push FRONTEND với tag "frontend-latest"  
echo "📦 Building frontend image..."
cd frontend
docker build -t frontend-image .
docker tag frontend-image:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:frontend-latest
cd ..

echo "⬆️ Pushing frontend image..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:frontend-latest

# Kiểm tra images trong ECR
echo "📋 Checking ECR images..."
aws ecr list-images --repository-name $REPO_NAME --region $AWS_REGION

# Deploy to Elastic Beanstalk
echo "🚀 Deploying to Elastic Beanstalk..."
eb deploy $EBS_ENV_NAME

echo "✅ Deployment completed successfully!"
echo "🌐 Application URL: $(eb status $EBS_ENV_NAME | grep CNAME | awk '{print $2}')"