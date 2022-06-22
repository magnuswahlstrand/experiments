package main

import (
	"github.com/magnuswahlstrand/generics/hello"
	"net/http"
)

func main() {
	http.HandleFunc("/hello", hello.RPC.Handle)
	http.ListenAndServe(":8080", nil)
}
