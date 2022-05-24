import * as cdk from "aws-cdk-lib";
import {CfnOutput, RemovalPolicy} from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as sqs from "aws-cdk-lib/aws-sqs";
import {AttributeType, StreamViewType, Table} from "aws-cdk-lib/aws-dynamodb";
import * as path from 'path'
import {DynamoEventSource, SqsDlq} from "aws-cdk-lib/aws-lambda-event-sources";
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {LambdaFunction} from "aws-cdk-lib/aws-events-targets";


export class WidgetService extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const userTable = new Table(this, `userTable`, {
            tableName: "user-userTable",
            partitionKey: {
                name: "userId",
                type: AttributeType.STRING,
            },
            readCapacity: 5,
            writeCapacity: 5,
            removalPolicy: RemovalPolicy.DESTROY,
            stream: StreamViewType.NEW_AND_OLD_IMAGES,
        });

        const logFn = new lambda.Function(this, 'authChallengeFn', {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline('exports.handler = function(event, ctx) { console.log(JSON.stringify(event)); return {} }'),
        });




        const createFn = new NodejsFunction(this, 'CreateUser', {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'create_user',
            entry: path.join(__dirname, `/../resources/create_user.ts`),
        });

        userTable.grantWriteData(createFn)
        const fnUrl = createFn.addFunctionUrl({
            authType: lambda.FunctionUrlAuthType.NONE
        })
        new CfnOutput(this, 'TheUrl', {
            value: fnUrl.url,
        });

        const dynFn = new NodejsFunction(this, 'DynamoDBLogger', {
            // memorySize: 1024,
            timeout: cdk.Duration.seconds(5),
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'dynamo_handler',
            entry: path.join(__dirname, `/../resources/dynamo.ts`),
        });

        const deadLetterQueue = new sqs.Queue(this, 'deadLetterQueue');
        dynFn.addEventSource(new DynamoEventSource(userTable, {
            startingPosition: lambda.StartingPosition.TRIM_HORIZON,
            batchSize: 5,
            bisectBatchOnError: true,
            onFailure: new SqsDlq(deadLetterQueue),
            retryAttempts: 10,
        }));


        const user_pool_default = new cognito.UserPool(
            this,
            "UserPool",
            {
                selfSignUpEnabled: true,
                accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
                signInAliases: {
                    email: true,
                },
                removalPolicy: cdk.RemovalPolicy.RETAIN
            }
        )

        logFn.addEventSource(new )
        const deadLetterQueue = new sqs.Queue(this, 'deadLetterQueue');
        dynFn.addEventSource(new CognitoEventSource(userTable, {
            startingPosition: lambda.StartingPosition.TRIM_HORIZON,
            batchSize: 5,
            bisectBatchOnError: true,
            onFailure: new SqsDlq(deadLetterQueue),
            retryAttempts: 10,
        }));

        // logFn.addPermission(
        //     "CognitoLambdaPermission",
        //     {
        //         principal: "hej",
        //         action: "lambda:InvokeFunction",
        //         sourceArn: user_pool_default.userPoolId
        //     }
        // )
    }
}
