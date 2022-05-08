package main

import (
	"io"
	"log"
	"os"
)

func parse() error {
	f, err := os.Open("service.go")
	if err != nil {
		return err
	}
	defer f.Close()

	f2, err := os.OpenFile("improved_service.go", os.O_RDWR|os.O_CREATE, 0755)
	if err != nil {
		log.Fatal(err)
	}
	defer f2.Close()

	w := io.MultiWriter(os.Stdout, f2, f2)
	if _, err := io.CopyN(w, f, 48); err != nil {
		return err
	}
	return nil
}

func main() {
	_ = parse()
}
