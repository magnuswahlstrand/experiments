package rpc

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi/v5"
	"net/http"
	"net/url"
)

func handlerWrapError[T, V any](fn func(T) (V, error)) func(w http.ResponseWriter, req *http.Request) error {
	return func(w http.ResponseWriter, req *http.Request) error {
		queryInput := req.URL.Query().Get("input")
		fmt.Println("Received", queryInput)
		unescapedInput, err := url.QueryUnescape(queryInput)
		if err != nil {
			return err
		}

		var input T
		if err := json.Unmarshal([]byte(unescapedInput), &input); err != nil {
			return err
		}

		fmt.Println("Use", input)
		out, err := fn(input)
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
}

func handlerWrap[T, V any](fn func(T) (V, error)) http.HandlerFunc {
	fn2 := handlerWrapError(fn)
	return func(w http.ResponseWriter, req *http.Request) {
		if err := fn2(w, req); err != nil {
			fmt.Fprintln(w, err.Error())
			return
		}
	}
}

type Client[T, V any] struct {
	url string
}

func (c *Client[T, V]) Call(procedure string, input T) (V, error) {
	u, err := url.Parse(c.url)
	if err != nil {
		return *new(V), err
	}

	b, err := json.Marshal(input)
	if err != nil {
		return *new(V), err
	}

	query := url.QueryEscape(string(b))
	values := u.Query()
	values.Add("input", query)
	u.RawQuery = values.Encode()

	u.Path = procedure
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

type RPC[T any, V any] struct {
	router *chi.Mux
}

func (rpc *RPC[T, V]) ListenAndServe(port string) {
	http.ListenAndServe(port, rpc.router)
}

func (rpc *RPC[T, V]) NewClient(url string) Client[T, V] {
	return Client[T, V]{
		url: url,
	}
}

func New[T any, V any](procedure string, fn func(T) (V, error)) RPC[T, V] {
	r := chi.NewRouter()

	r.Get("/"+procedure, handlerWrap(fn))
	r.Get("/", func(writer http.ResponseWriter, request *http.Request) {
		writer.Write([]byte("hello"))
	})
	return RPC[T, V]{
		router: r,
	}
}
