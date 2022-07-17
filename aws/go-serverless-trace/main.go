package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/cloudwatchevents"
	"github.com/aws/aws-sdk-go-v2/service/cloudwatchevents/types"
	"github.com/aws/aws-xray-sdk-go/instrumentation/awsv2"
	"github.com/aws/aws-xray-sdk-go/xray"
	"log"
	"time"
)

func HandleRequest(ctx context.Context) error {
	return DoSomething(ctx)
}

func DoSomething(ctx context.Context) error {
	ctx, seg := xray.BeginSegment(ctx, "INSIDE HANDLER")
	defer seg.Close(nil)

	_, subSeg := xray.BeginSubsegment(ctx, "MAKE REQUEST TO SOMEWHERE")
	subSeg.Close(nil)

	_, subSeg2 := xray.BeginSubsegment(ctx, "FAILING REQUEST")
	subSeg2.Close(errors.New("something bad happened :-("))

	input := &cloudwatchevents.PutEventsInput{
		Entries: []types.PutEventsRequestEntry{
			{
				Detail:       aws.String(`{"name":"magnus"}`),
				DetailType:   aws.String("TestCreated"),
				EventBusName: aws.String("magnus-test-bus"),
				Resources: []string{
					"some lambda ARN",
				},
				Source:      aws.String("magnus.source"),
				Time:        aws.Time(time.Now()),
				TraceHeader: nil,
			},
		},
	}

	out, err := eventsClient.PutEvents(ctx, input)
	if err != nil {
		return err
	}
	fmt.Printf("%#v\n", out)

	return nil
}

var eventsClient *cloudwatchevents.Client

func main() {
	cfg, err := config.LoadDefaultConfig(context.TODO(), func(o *config.LoadOptions) error {
		o.Region = "eu-west-1"
		return nil
	})
	if err != nil {
		log.Fatalf("LoadDefaultConfig: %s\n", err)
	}
	eventsClient = cloudwatchevents.NewFromConfig(cfg)
	// Instrumenting AWS SDK v2
	awsv2.AWSV2Instrumentor(&cfg.APIOptions)
	//lambda.Start(HandleRequest)
	DoSomething(context.Background())
}
