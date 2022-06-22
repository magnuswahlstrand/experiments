package rpc

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

type RPC[T any, V any] struct {
	fn func(T) (V, error)
}

func clientRequest[T any, V any](rpcURL string, procedure string, input T) (V, error) {
	fmt.Println(rpcURL, procedure, input)
	u, err := url.Parse(rpcURL)
	if err != nil {
		return *new(V), err
	}

	fmt.Println("marshall", input)
	b, err := json.Marshal(input)
	if err != nil {
		return *new(V), err
	}

	fmt.Println("escape", string(b))
	query := url.QueryEscape(string(b))
	values := u.Query()
	values.Add("input", query)
	u.RawQuery = values.Encode()

	u.Path = procedure
	fmt.Println("request", u)
	resp, err := http.DefaultClient.Get(u.String())
	if err != nil {
		return *new(V), err
	}

	var out V
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return *new(V), err
	}
	return out, nil
}

func (rpc *RPC[T, V]) handlerFoo(w http.ResponseWriter, req *http.Request) error {
	queryInput := req.URL.Query().Get("input")
	fmt.Println("Received", queryInput)
	unescapedInput, err := url.QueryUnescape(queryInput)
	if err != nil {
		return err
	}

	var input T
	fmt.Println("Received", unescapedInput)
	if err := json.Unmarshal([]byte(unescapedInput), &input); err != nil {
		return err
	}

	fmt.Println("Use", input)
	out, err := rpc.fn(input)
	if err != nil {
		return err
	}

	b, err := json.Marshal(out)
	if err != nil {
		return err
	}

	if _, err := w.Write(b); err != nil {

		return err
	}

	return nil
}

func (rpc *RPC[T, V]) Handle(w http.ResponseWriter, req *http.Request) {
	if rpc.handlerFoo(w, req) != nil {
		fmt.Fprintln(w, rpc.handlerFoo(w, req).Error())
		return
	}
}

type Client[T, V any] struct {
	url string
}

func (c *Client[T, V]) Call(procedure string, input T) (V, error) {
	fmt.Println(c.url, procedure, input)
	u, err := url.Parse(c.url)
	if err != nil {
		return *new(V), err
	}

	fmt.Println("marshall", input)
	b, err := json.Marshal(input)
	if err != nil {
		return *new(V), err
	}

	fmt.Println("escape", string(b))
	query := url.QueryEscape(string(b))
	values := u.Query()
	values.Add("input", query)
	u.RawQuery = values.Encode()

	u.Path = procedure
	fmt.Println("request", u)
	resp, err := http.DefaultClient.Get(u.String())
	if err != nil {
		return *new(V), err
	}

	var out V
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return *new(V), err
	}
	return out, nil
}

func (rpc *RPC[T, V]) NewClient(url string) Client[T, V] {
	return Client[T, V]{
		url: url,
	}
}

func New[T any, V any](fn func(T) (V, error)) RPC[T, V] {
	return RPC[T, V]{
		fn: fn,
	}
}
