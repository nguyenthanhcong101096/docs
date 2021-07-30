---
sidebar_position: 12
---

```go
package main

import "fmt"

type Student struct {
	name string
}

func (s Student) getName() string {
	return s.name
}

// defint method
// func (t Type) methodName(params) returns { body code }
// (t Type) -> receiver
// 1. value receiver
// 2. poniter receiver

// 1. value receiver -> tạo ra giá tri copy của struct -> sau khi out k làm ảnh hưởng giá trị gốc
func (s Student) changeName() {
	s.name = "CONG"
}

// 2. pointer receiver
func (s *Student) changeName2() {
	s.name = "ROBIN"
}

// non-struct
type String string

func (s String) append(str string) string {
	return fmt.Sprintf("%s%s", s, str)
}

func main() {
	student := Student{name: "hola"}

	name := student.getName()
	fmt.Println(name)

	student.changeName2()
	fmt.Println(student.name)

	//non-struct
	s1 := String("a")
	newStr := s1.append("b")
	fmt.Println(newStr)
}
```
