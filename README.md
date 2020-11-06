# aws-serverless-order-process-node-stepfunctions-rest-api
Example sets up AWS serverless backend to orchestrate order workflow, create, get, update and delete DB records. Stepfunction for Orchestration. API Gateway acts as REST API, Lambda as functions and DynamoDB to store the data.

# Structure
order-process JSON file for order workflow orchestration. 
Refer to api folder for CRUD services. API Gateway -> Lambda -> DynamoDB. 
API Gateway CORS enabled + Custom domain with API SSL certificate

# Use Cases
Workflow modelling, Order Orchestration etc. || API for frontend Web App, Mobile App. 

# Scaling
API Gateway + Lambda provides auto-scaling. Lambda concurrent executions upto 1000 Increase DynamoDB ProvisionedThroughput: RCU and WCU in serverless.yml

# Security
Sample code in serverless.yml to deploy customDomain and SSL Certification. Add API Keys and Trottling to API Gateway

# Serverless Framework
Serverless Framework to deploy the complete stack on fly and remove on fly. Custamize the serverless.yaml template refering to comments in [BOLD].

# CI/CD
Create AWS CodePipeline and use the buildspec.yml template to Automate Code Deployment. 
Everytime a git commit CodePipeline auto deploys.
