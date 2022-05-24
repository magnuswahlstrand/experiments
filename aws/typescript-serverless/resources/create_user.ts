import {APIGatewayProxyHandlerV2} from 'aws-lambda';

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";

const tableName = process.env.USERS_TABLE;

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client); // client is DynamoDB client


export const create_user: APIGatewayProxyHandlerV2 = async function (event) {
    console.log(event)

    if (!event?.queryStringParameters) {
        return {
            statusCode: 400,
            body: "query param missing"
        }
    }


    if (!event.queryStringParameters['id']) {
        return {
            statusCode: 400,
            body: "query param missing"
        }
    }


    const id = event.queryStringParameters['id']

    const resp = await ddbDocClient.send(
        new PutCommand({
            TableName: tableName,
            Item: {
                userId: id,
                id: id,
                content: "content from DynamoDBDocument"
            }
        }))

    console.log("resp")
    console.log(resp)

    return {
        statusCode: 200,
        body: JSON.stringify({
            'name': 'Magnus',
        }),
    }
}
