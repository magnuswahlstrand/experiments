import {DynamoDBStreamHandler,} from 'aws-lambda';
import {unmarshall} from "@aws-sdk/util-dynamodb";
// const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");


const bucketName = process.env.BUCKET;

export const dynamo_handler: DynamoDBStreamHandler = async function (event, context) {
    event.Records.map(e => {
        console.log("EVENT")
        console.log(e.eventName)
        console.log(e.userIdentity)
        console.log(e.dynamodb)
        if (e?.dynamodb?.NewImage) {
            console.log(unmarshall(e.dynamodb.NewImage))
        }
    })
}

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_util_dynamodb.html
