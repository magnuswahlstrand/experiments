package main

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-xray-sdk-go/xray"
	"log"
	"net/http"
)

func main() {
	cfg, err := config.LoadDefaultConfig(context.TODO(), func(o *config.LoadOptions) error {
		o.Region = "us-east-1"
		return nil
	})
	if err != nil {
		log.Fatalf("LoadDefaultConfig: %s\n", err)
	}

	ctx := context.Background()
	url := "https://2ul2mdnk43.execute-api.us-east-1.amazonaws.com/items"
	//myClient := xray.Client(http.DefaultClient)

	ctx, seg := xray.BeginSegment(ctx, "Request from client")
	defer seg.Close(nil)

	ctx, seg2 := xray.BeginSubsegment(ctx, "Sub in client")
	defer seg2.Close(nil)

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Fatalf("NewRequest: %s", err)
	}
	cred, err := cfg.Credentials.Retrieve(ctx)
	if err != nil {
		log.Fatalf("Retrieve: %s", err)
	}
	cred.
	resp, err := cfg.HTTPClient.Do(req)
	//resp, err := ctxhttp.Get(ctx, xray.Client(cfg.HTTPClient), url)
	//resp, err := myClient.Do(req)
	if err != nil {
		log.Fatalf("Get: %s\n", err)
	}
	fmt.Println(resp.StatusCode)
}
