import {ConditionalCheckFailedException, DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({
    region: 'eu-west-1'
});
const ddbDocClient = DynamoDBDocumentClient.from(client); // client is DynamoDB client

console.log("yay")

const id = "magnus"
const tableName = "user-userTable"

const put = new PutCommand({
    TableName: tableName,
    Item: {
        userId: id,
        id: "xx" + id,
        content: "content from DynamoDBDocument",
        owners: new Set(["magnus", "john"]),
        SubscriptionType: "Basic"
    },
    ConditionExpression: "attribute_not_exists(userId)",
})

const resp = ddbDocClient.send(put)
resp.then(() => {
    console.log('creation complete')
}).catch(
    (err) => {
        if (err instanceof ConditionalCheckFailedException) {
            console.log(err.name); //works
            console.log(err.$fault); //error as expected
            console.log(err.$metadata); //error as expected
            // console.log(JSON.stringify(err, null, "   ")); //error as expected
        } else {
            console.log(err); // this could still happen
            throw err
        }
    }
).finally(
    () => {
        console.log("finally")
    }
)


const resp2 = ddbDocClient.send(
    new UpdateCommand({
        Key: {userId: id},
        TableName: tableName,
        UpdateExpression: "Set #st = :type",
        ConditionExpression: "contains(owners, :user)",
        ExpressionAttributeNames: {
            "#st": "SubscriptionType"
        },
        ExpressionAttributeValues: {
            ":type": "Pro",
            ":user": id
        }
    }))
resp2.then(() => console.log(
    'update complete'
))


const queryResp = ddbDocClient.send(
    new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "userId = :id",
        ExpressionAttributeValues: {
            ":id": id,
        },
        ConsistentRead: true,
    }))


queryResp.then((res => {
    console.log(res.Items)
}))
