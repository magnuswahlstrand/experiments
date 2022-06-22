package main

import (
	"github.com/magnuswahlstrand/generics/hello"
	"net/http"
)

func main() {
	//lambda.Start(APIGatewayV2Adapter(HelloWorld))
	http.HandleFunc("/hello", hello.Handler)
	http.ListenAndServe(":8080", nil)
}
