---
sidebar_position: 8
---

```go
package main

import "fmt"

type Student struct {
	id int
	name string
}

func main {
	//Zero value
	var myStudent Student
	myStudent.id = 10
	myStudent.name = "hola"

	myStudent1 := Student{
		id: 1,
		name: "hola",
	}

	fmt.Println(myStudent1.id)

	var myStudent1 Student = struct {
		id int
		name string
	} {
		id: 1,
		name: "hola"
	}

	// Anonymous struct
	var myAnonymousStruct = struct {
		id int
		name string
	} {
		id: 1,
		name: "hola"
	}

	// Pointer -> struct
	pointer := &Student{
		id: 999,
		name: "hola",
	}

	fmt.Println((*pointer).id) // pointer get value
	fmt.Println(pointer.name)  // pointer get value

	// Anonymous fileds
	type noName struct {
		string
		int
	}

	n := noName{ "hola", 9999}

	// Nested struct

	type Person string {
		id int
		profile Profile
	}

	type Profile struct {
		email string
		phone string
	}

	myPerson := Person{
		id: 999,
		profile: Profile{
			email: "example@gmail.com",
			phone: "90293029",
		},
	}

	// So sánh 2 struct
	myStudent2 = Student{id: 1, name: "hola"}
	myStudent3 = Student{id: 1, name: "hola"}

	myStudent2 == myStudent3 //true
}
```
