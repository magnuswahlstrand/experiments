package main

import (
	"fmt"
	"github.com/magnuswahlstrand/generics/hello"
	"log"
)

func main() {
	resp, err := hello.HelloClient("http://localhost:8080", "hello", hello.Req{Name: "Magnus"})
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println("success!", resp.Greeting)
}
