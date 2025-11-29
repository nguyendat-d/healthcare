#!/bin/bash

set -e

echo "🚀 Starting Backend Deployment..."

# Configuration
AWS_ACCOUNT_ID="470201304657"
AWS_REGION="us-east-1"
REPO_NAME="healthcare-backend"
EBS_APP_NAME="healthcare-backend"
EBS_ENV_NAME="healthcare-backend-prod"

echo "📋 Configuration:"
echo "   AWS Account: $AWS_ACCOUNT_ID"
echo "   Region: $AWS_REGION"
echo "   ECR Repo: $REPO_NAME"
echo "   EB App: $EBS_APP_NAME"

# Check if required files exist
echo "🔍 Checking required files..."
if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile not found!"
    exit 1
fi

if [ ! -f "Dockerrun.aws.json" ]; then
    echo "❌ Dockerrun.aws.json not found!"
    exit 1
fi

if [ ! -f ".ebextensions/01-environment.config" ]; then
    echo "❌ .ebextensions/01-environment.config not found!"
    exit 1
fi

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build Docker image
echo "📦 Building Docker image..."
docker build -t $REPO_NAME .

# Tag and push to ECR
echo "🏷️ Tagging image..."
docker tag $REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest

echo "⬆️ Pushing to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest

# Create deployment package
echo "📦 Creating deployment package..."
zip -r backend-deploy.zip Dockerrun.aws.json .ebextensions/

echo "✅ Backend deployment preparation completed!"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Go to AWS Elastic Beanstalk Console: https://us-east-1.console.aws.amazon.com/elasticbeanstalk"
echo "2. Click 'Create Application'"
echo "3. Application name: '$EBS_APP_NAME'"
echo "4. Platform: 'Docker' → 'Docker running on 64bit Amazon Linux 2023'"
echo "5. Application code: 'Upload your code'"
echo "6. Choose file: 'backend-deploy.zip' (file vừa được tạo)"
echo "7. Click 'Create application'"
echo ""
echo "⏳ Deployment sẽ mất 5-10 phút..."
echo "🌐 Sau khi xong, truy cập: http://$EBS_ENV_NAME.us-east-1.elasticbeanstalk.com/health"