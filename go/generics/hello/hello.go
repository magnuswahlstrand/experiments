package hello

import (
	"fmt"
	"github.com/magnuswahlstrand/generics/rpc"
)

type Req struct {
	Name string `json:"name"`
}

type Resp struct {
	Greeting string `json:"greeting"`
}

func HelloWorld(req Req) (Resp, error) {
	return Resp{Greeting: fmt.Sprintf("Hello, %s!", req.Name)}, nil
}

var RPC = rpc.New(HelloWorld)
