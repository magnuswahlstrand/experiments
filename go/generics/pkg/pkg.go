package pkg

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

func Constructor[T any, V any](fn func(T) (V, error)) (http.HandlerFunc, func(string, string, T) (V, error)) {
	//fn := HelloWorld
	fn2 := func(w http.ResponseWriter, req *http.Request) error {
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

	handler := func(w http.ResponseWriter, req *http.Request) {
		err := fn2(w, req)
		if err != nil {
			fmt.Fprintln(w, err.Error())
			return
		}
	}
	return handler, func(rpcURL string, procedure string, input T) (V, error) {
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
}
