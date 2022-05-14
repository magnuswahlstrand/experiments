package main

import (
	"bufio"
	"bytes"
	"encoding/csv"
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"sort"
	"strings"
)

const noteSeparator = "------------"
const sectionSeparator = "----"
const okMarker = "(OK)"

type Option struct {
	Label     string
	IsCorrect bool
}

var (
	frontTmpl = template.Must(template.New("").Parse(`
{{.Question}}
<ul>{{range .Options}}
<li class='option'>{{ .Label }}</li>{{end}}
</ul>`))
	backTmpl = template.Must(template.New("").Parse(`
{{.Question}}
<ul>{{range .Options}}
<li class='option {{ if .IsCorrect }}correct{{ else }}incorrect{{ end }}'>{{ .Label }}</li>{{end}}
</ul>`))
)

func parse(s string) (string, string, bool) {
	question, answer, found := strings.Cut(s, sectionSeparator)
	if !found {
		return "", "", false
	}
	if gappedRegex.MatchString(question) {
		return parseGapped(question, answer)
	}
	return parseMultipleChoice(question, answer)
}

var gappedRegex = regexp.MustCompile("_{3,20}")

func parseMultipleChoice(question string, answerPart string) (string, string, bool) {
	data := struct {
		Question string
		Options  []Option
	}{
		Question: strings.TrimSpace(question),
	}

	for _, o := range strings.Split(strings.TrimSpace(answerPart), "\n") {
		data.Options = append(data.Options, Option{
			Label:     strings.ReplaceAll(o, okMarker, ""),
			IsCorrect: strings.Contains(o, okMarker),
		})
	}

	var frontBuf bytes.Buffer
	if err := frontTmpl.Execute(&frontBuf, data); err != nil {
		log.Fatalln(err)
	}

	var backBuf bytes.Buffer
	if err := backTmpl.Execute(&backBuf, data); err != nil {
		log.Fatalln(err)
	}

	return frontBuf.String(), backBuf.String(), true
}

func findCorrect(answerPart string) string {
	for _, s := range strings.Split(answerPart, "\n") {
		if strings.Contains(s, okMarker) {
			return strings.ReplaceAll(s, okMarker, "")
		}
	}
	log.Fatalln("No answer found in", answerPart)
	return ""
}

func parseGapped(question string, answerPart string) (string, string, bool) {
	question = strings.TrimSpace(question)

	answer := findCorrect(answerPart)
	insert := fmt.Sprintf("<span class='correct'>%s</span>", strings.TrimSpace(answer))
	back := gappedRegex.ReplaceAllString(question, insert)
	return question, back, true
}

func parseInput(input string) [][]string {
	b, err := ioutil.ReadFile(input)
	if err != nil {
		log.Fatalf("ReadFile: %s", err)
	}

	var notes [][]string
	for _, s := range strings.Split(string(b), noteSeparator) {
		front, back, ok := parse(s)
		if !ok {
			continue
		}

		notes = append(notes, []string{front, back})
	}

	return notes
}

func main() {
	targetFile := "review_2.txt"
	parseTestHTML("review_2.html", targetFile)
	createCSV(targetFile)
}

func createCSV(targetFile string) {
	csvFile, err := os.Create("deck.csv")
	if err != nil {
		log.Fatalf("failed creating file: %s", err)
	}
	defer csvFile.Close()

	w := io.MultiWriter(csvFile, os.Stdout)
	csvwriter := csv.NewWriter(w)
	for _, empRow := range parseInput(targetFile) {
		if err = csvwriter.Write(empRow); err != nil {
			log.Fatalf("Write: %s", err)
		}
	}
	csvwriter.Flush()
}

var (
	regexQuestion = regexp.MustCompile(">(.*?)<\\/p>")
)

// match html tag and replace it with ""
func RemoveHtmlTag(in string) string {
	// regex to match html tag
	const pattern = `(<\/?[a-zA-A]+?[^>]*\/?>)*`
	r := regexp.MustCompile(pattern)
	groups := r.FindAllString(in, -1)
	// should replace long string first
	sort.Slice(groups, func(i, j int) bool {
		return len(groups[i]) > len(groups[j])
	})
	for _, group := range groups {
		if strings.TrimSpace(group) != "" {
			in = strings.ReplaceAll(in, group, "")
		}
	}
	return in
}

func parseTestHTML(filename, output string) {
	file, err := os.Open(filename)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	outFile, err := os.OpenFile(output, os.O_WRONLY|os.O_CREATE, 0644)
	if err != nil {
		log.Fatal(err)
	}
	defer outFile.Close()

	scanner := bufio.NewScanner(file)
	var lastCorrect bool
	var nextIsQuestion bool
	var out string
	var nQuestions int
	for scanner.Scan() {
		out = ""
		s := scanner.Text()
		switch {
		case strings.Contains(s, "wpProQuiz_question_text"):
			nextIsQuestion = true
		case nextIsQuestion:
			//_, after, _ := strings.Cut(s, ">")
			//before, _, _ := strings.Cut(after, "<")
			s = RemoveHtmlTag(s)
			out = noteSeparator + "\n" + s + "\n" + sectionSeparator
			nextIsQuestion = false
			nQuestions++
		case strings.Contains(s, "wpProQuiz_questionListItem"):
			lastCorrect = strings.Contains(s, "wpProQuiz_answerCorrect")
		case strings.Contains(s, "wpProQuiz_questionInput"):
			//<input class="wpProQuiz_questionInput bbstyled" type="radio" name="question_12_8536" value="3" disabled="disabled"><span class="input-style"></span> VPC Peering												</label>
			_, after, _ := strings.Cut(s, "</span>")
			after = strings.Trim(after, "</label>")
			after = strings.TrimSpace(after)
			out = after
			if lastCorrect {
				out += " (OK)"
			}
		}
		if out != "" {
			fmt.Fprintln(outFile, out)
			fmt.Fprintln(os.Stdout, out)
		}

	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}
