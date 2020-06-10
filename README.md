# Trail.me

![Build Status Master](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoieDJDbzdvdWZkRDZFNXFxSlRJYnNjcGgrWFk5L0hIaTMwSWFodERua002U0s1NWFERTMrenl4TGpLTEFXaUVYeC81UXhZQ2IzYTlkT0l4RGd6TGZxckVRPSIsIml2UGFyYW1ldGVyU3BlYyI6IldwNnBNdk1aZGh0cGtuOVUiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

![Build Status Develop](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiTENIOFlGdEJFYXUvZ3VvWTM1aHJObkhRcFoyVFdkY0JuTGF0K2JNYUVXSlhCU0tNYVJhQmtqK1AzMjVpQVlFaU1BdWFGQm9tTkxpMzNNZkNxdFB5MUtRPSIsIml2UGFyYW1ldGVyU3BlYyI6InBDUlRBSUFSU0hwTFJEZVUiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)


Trail.me enables Swiss biker and hiker to simply plan their next strips and export it for their outdoor navigation system.

**Used frameworks / libraries:**
- ReactJS
- Redux / reselect
- Jest
- material-ui
- react-hook-form
- Semantic-Release

## Getting started

### Installation
Following packages are used in development environment:
- node >= 12
- git
- VisualStudio Code
- Jest

### Start development
1. Install package dependencies: `npm install`
2. Start project: `npm start`
3. Run test cases: `npm run test`
4. See coverage: `npm run test:coverage`

## Deployment

Deployment is only supported by automated `Codebuild` deployment by AWS Codebuild. After merge on `develop` branch, Codebuild will automatically build and deploy to test environment. On merge on `master` production build will be deployed to prod environment. Version history is fully covered by `Semantic-Release`.
