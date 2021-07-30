---
sidebar_position: 10
---


```go
package main

import "fmt"

type person struct {
	first  string
	last   string
	saying string
}

type secretAgent struct {
	person
	ltk bool
}

type humman interface {
	speak()
}

func (p person) speak() {
	fmt.Println(p.first, "says", p.saying)
}

func (p secretAgent) speak() {
	fmt.Println(p.first, "says polymorphism", p.saying)
}

func foo(h humman) {
	h.speak()
}

func main() {
	p1 := person{
		first:  "first 1",
		last:   "last 1",
		saying: "person 1",
	}

	p2 := person{
		first:  "first 2",
		last:   "last 2",
		saying: "person 2",
	}

	s1 := secretAgent{
		person: person{
			first:  "first s1",
			last:   "last s1",
			saying: "secretAgent s1",
		},
		ltk: true,
	}

	p1.speak()
	p2.speak()
	s1.speak()

	fmt.Println("-----------------")

	foo(p1)
	foo(p2)
	foo(s1)
}
```
