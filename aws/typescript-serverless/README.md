# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template


## Q&As

##### Q: What type is the format of the event that the Lambda is called with, when using a Function URL?
> The request and response event formats follow the same schema as the Amazon API Gateway payload format version 2.0.

https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html#urls-payloads

In typescript we can de use the `APIGatewayProxyHandlerV2` type for our function.

```typescript
import {APIGatewayProxyHandlerV2,} from 'aws-lambda';

export const create_user: APIGatewayProxyHandlerV2 = async function (event) {
    // ...
```


#### How do we use `DynamoDBDocumentClient` to call DynamoDB?
