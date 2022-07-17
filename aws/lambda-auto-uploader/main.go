package main

import (
	"archive/zip"
	"bytes"
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/lambda"
	"io"
	"log"
	"os"
	"os/exec"
	"path"
	"time"
)

func buildFile(inputDir string) ([]byte, error) {
	tmpDir, err := os.MkdirTemp("", "lambdabuild")
	if err != nil {
		log.Fatal(err)
	}
	defer os.RemoveAll(tmpDir)

	output, err := buildGoBinary(inputDir, tmpDir)
	if err != nil {
		return nil, err
	}

	return zipBytes(output)
}

func buildGoBinary(srcDir, buildDir string) (string, error) {
	target := path.Join(buildDir, "main")
	cmd := exec.Command("go", "build", "-o", target, srcDir)
	cmd.Dir = srcDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stdout
	cmd.Env = append(os.Environ(),
		"GOOS=linux",
		"GOARCH=amd64",
	)

	if err := cmd.Run(); err != nil {
		return "", err
	}

	if err := os.Chmod(target, 0755); err != nil {
		return "", err
	}

	return target, nil
}

func zipBytes(target string) ([]byte, error) {
	buf := &bytes.Buffer{}
	zipWriter := zip.NewWriter(buf)
	zf, err := zipWriter.Create("main")
	if err != nil {
		return nil, err
	}

	f, err := os.Open(target)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	if _, err := io.Copy(zf, f); err != nil {
		return nil, err
	}
	zipWriter.Close()
	return buf.Bytes(), nil
}

func uploadCode(functionName string, b []byte) error {
	ctx := context.Background()
	cfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion("us-east-1"))
	if err != nil {
		log.Fatalln(err)
	}
	client := lambda.NewFromConfig(cfg)
	//region := "us-east-1"
	_, err = client.UpdateFunctionCode(ctx, &lambda.UpdateFunctionCodeInput{
		FunctionName: aws.String(functionName),
		ZipFile:      b,
	})
	if err != nil {
		log.Fatalln(err)
	}
	return nil
}

func main() {
	t := time.Now()
	defer func() {
		fmt.Println(time.Since(t))
	}()

	b, err := buildFile("../go-serverless")
	if err != nil {
		log.Fatalln(err)
	}

	functionName := "http-crud-tutorial-function-2"
	if err := uploadCode(functionName, b); err != nil {
		return
	}

	fmt.Println("a")
}
