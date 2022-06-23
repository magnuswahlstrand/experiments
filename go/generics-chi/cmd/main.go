package main

import (
	"github.com/magnuswahlstrand/generics/hello"
)

func main() {
	//http.HandleFunc("/hello", hello.RPC.Handle)
	//http.ListenAndServe(":8080", nil)
	hello.RPC.ListenAndServe(":8080")
}
