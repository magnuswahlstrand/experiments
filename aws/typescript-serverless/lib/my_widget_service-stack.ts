import * as cdk from "aws-cdk-lib";
import {RemovalPolicy} from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as sqs from "aws-cdk-lib/aws-sqs";
import {HttpApi, HttpMethod} from '@aws-cdk/aws-apigatewayv2-alpha';
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import {AttributeType, StreamViewType, Table} from "aws-cdk-lib/aws-dynamodb";
import {join} from 'path'
import {DynamoEventSource, SqsDlq} from "aws-cdk-lib/aws-lambda-event-sources";
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from "path";



export class WidgetService extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const bucket = new s3.Bucket(this, "WidgetStore");

        const handler = new lambda.Function(this, "WidgetHandler", {
            runtime: lambda.Runtime.NODEJS_16_X, // So we can use async in widget.js
            code: lambda.Code.fromAsset("resources"),
            handler: "widgets.main",
            environment: {
                BUCKET: bucket.bucketName
            }
        });
        bucket.grantReadWrite(handler); // was: handler.role);


        const table = new Table(this, `userTable`, {
            tableName: "user-table",
            partitionKey: {
                name: "userId",
                type: AttributeType.STRING,
            },
            readCapacity: 5,
            writeCapacity: 5,
            removalPolicy: RemovalPolicy.DESTROY,
            stream: StreamViewType.NEW_AND_OLD_IMAGES,
        });

        const dynFn = new NodejsFunction(this, 'DynamoDBLogger', {
            // memorySize: 1024,
            timeout: cdk.Duration.seconds(5),
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'dynamo_handler',
            entry: path.join(__dirname, `/../resources/dynamo.ts`),
        });

        // const dynFn = new lambda.Function(this, "DynamoDBLogger", {
        //     runtime: lambda.Runtime.NODEJS_16_X, // So we can use async in widget.js
        //     code: lambda.Code.fromAsset("resources"),
        //     handler: "dynamo.dynamo_handler",
        //     environment: {
        //         BUCKET: bucket.bucketName
        //     }
        // });

        const deadLetterQueue = new sqs.Queue(this, 'deadLetterQueue');
        dynFn.addEventSource(new DynamoEventSource(table, {
            startingPosition: lambda.StartingPosition.TRIM_HORIZON,
            batchSize: 5,
            bisectBatchOnError: true,
            onFailure: new SqsDlq(deadLetterQueue),
            retryAttempts: 10,
        }));


        const api_v2 = new HttpApi(this, "widgets-api-v2", {
            apiName: "Widget Service V2",
            description: "This service serves widgets.",
        })


        const getWidgetsIntegration2 = new HttpLambdaIntegration("WidgetHandlerIntegration", handler, {});

        const route = api_v2.addRoutes({
            path: "/widgets",
            methods: [HttpMethod.GET],
            integration: getWidgetsIntegration2,
        })


        new cdk.CfnOutput(this, "route", {
            value: route[0].toString(),
            description: "request URL"
        })

        new cdk.CfnOutput(this, "full_url", {
            value: join(api_v2.url ?? "", route[0].path ?? ""),
            description: "request URL"
        })
    }
}
