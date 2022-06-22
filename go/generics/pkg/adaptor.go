package pkg

import (
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"net/url"
)

func APIGatewayV2Adapter[T any, V any](f func(T) (V, error)) func(events.APIGatewayV2HTTPRequest) (events.APIGatewayProxyResponse, error) {
	fn := func(request events.APIGatewayV2HTTPRequest) (events.APIGatewayProxyResponse, error) {
		queryInput := request.QueryStringParameters["input"]
		unescapedInput, err := url.QueryUnescape(queryInput)
		if err != nil {
			return events.APIGatewayProxyResponse{Body: err.Error(), StatusCode: 500}, nil
		}

		var req T
		if err := json.Unmarshal([]byte(unescapedInput), &req); err != nil {
			return events.APIGatewayProxyResponse{Body: err.Error(), StatusCode: 500}, nil
		}

		out, err := f(req)
		if err != nil {
			return events.APIGatewayProxyResponse{Body: err.Error(), StatusCode: 500}, nil
		}

		b, err := json.Marshal(out)
		if err != nil {
			return events.APIGatewayProxyResponse{Body: err.Error(), StatusCode: 500}, nil
		}

		return events.APIGatewayProxyResponse{
			Body:       string(b),
			StatusCode: 200,
		}, nil
	}

	return fn
}
