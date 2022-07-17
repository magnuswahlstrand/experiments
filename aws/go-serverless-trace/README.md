# Go Serverless

Part of the AWS workshop [https://simple-crud-api.workshop.aws](https://simple-crud-api.workshop.aws)

## Build
```
GOOS=linux GOARCH=amd64 go build -o main main.go; zip function.zip main
```

## Working with X-Ray

### Debug
Got the following error `permission denied: PathError null xray`.

Solution:
Chmod file 
```
GOOS=linux GOARCH=amd64 go build -o main main.go; chmod 777 main; zip function.zip main
```
