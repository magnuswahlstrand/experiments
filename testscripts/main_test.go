package main

import (
	"github.com/rogpeppe/go-internal/testscript"
	"os"
	"testing"
)

func TestMain(m *testing.M) {

	os.Exit(testscript.RunMain(m, map[string]func() int{
		"parse": func() int {
			if err := parse(); err != nil {
				os.Stderr.WriteString(err.Error())
				return 1
			}
			return 0
		},
	}))
}

func TestFoo(t *testing.T) {
	testscript.Run(t, testscript.Params{
		Dir: "testdata",
	})
}
