package main

import (
	"fmt"
	"github.com/magnuswahlstrand/generics/hello"
	"log"
)

func main() {
	client := hello.RPC.NewClient("http://localhost:8080")

	resp, err := client.Call("hello", hello.Req{Name: "Magnus"})
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println("success!", resp.Greeting)
}
