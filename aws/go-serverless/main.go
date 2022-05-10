package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"strconv"
	"strings"
)

const (
	tableName = "http-crud-tutorial-items"
)

type Item struct {
	ID    string `json:"id"`
	Price int    `json:"price"`
	Name  string `json:"name"`
}

func HandleRequest(ctx context.Context, request events.APIGatewayV2HTTPRequest) (string, error) {
	b2, _ := json.MarshalIndent(request, "", "  ")
	fmt.Println(string(b2))
	//return string(b2), nil
	//pathWithID := regexp.MustCompile("^/items/[a-zA-Z0-9]*$")
	//fmt.Println("HEJ")
	//s := fmt.Sprintf("%t %q\n", pathWithID.MatchString(request.Path), request.Path)

	var body interface{}
	cfg, err := config.LoadDefaultConfig(context.TODO(), func(o *config.LoadOptions) error {
		o.Region = "us-east-1"
		return nil
	})
	if err != nil {
		return "", fmt.Errorf("LoadDefaultConfig: %w", err)
	}
	svc := dynamodb.NewFromConfig(cfg)

	if err != nil {
		return "", fmt.Errorf("LoadDefaultConfig: %w", err)
	}

	switch request.RequestContext.RouteKey {
	case "DELETE /items/{id}":
		id := request.PathParameters["id"]
		_, err := svc.DeleteItem(ctx, &dynamodb.DeleteItemInput{
			TableName: aws.String(tableName),
			Key: map[string]types.AttributeValue{
				"id": &types.AttributeValueMemberS{Value: id},
			},
		})
		if err != nil {
			return "", err
		}
		body = fmt.Sprintf("Deleted item %q", id)
	case "GET /items/{id}":
		id := request.PathParameters["id"]
		out, err := svc.GetItem(ctx, &dynamodb.GetItemInput{
			TableName: aws.String(tableName),
			Key: map[string]types.AttributeValue{
				"id": &types.AttributeValueMemberS{Value: id},
			},
		})
		if err != nil {
			return "", err
		}
		body = out.Item
	case "GET /items":
		out, err := svc.Scan(ctx, &dynamodb.ScanInput{
			TableName: aws.String(tableName),
		})
		if err != nil {
			return "", err
		}
		body = out.Items
	case "PUT /items":
		var i Item
		err := json.NewDecoder(strings.NewReader(request.Body)).Decode(&i)
		if err != nil {
			return "", err
		}

		_, err = svc.PutItem(ctx, &dynamodb.PutItemInput{
			TableName: aws.String(tableName),
			Item: map[string]types.AttributeValue{
				"id":    &types.AttributeValueMemberS{Value: i.ID},
				"price": &types.AttributeValueMemberN{Value: strconv.Itoa(i.Price)},
				"name":  &types.AttributeValueMemberS{Value: i.Name},
			},
		})
		if err != nil {
			return "", err
		}
		body = fmt.Sprintf("Put item %q", i.ID)
	default:
		//return "", fmt.Errorf("unknown path %q or method %q, %q", request.Path, request.HTTPMethod)
		return "", fmt.Errorf("unexpected RouteKey %q", request.RequestContext.RouteKey)
	}

	b, err := json.MarshalIndent(body, "", "  ")
	if err != nil {
		return "", err
	}
	return string(b), err
}

func main() {
	lambda.Start(HandleRequest)
}
