---
sidebar_position: 9
---

```go
package main

import "fmt"

// Khái niệm
// Là tập methods mà object có thể implement.
// Nó định nghĩa hành vi của đối tượng (thể hiện tính đa hình của đối tượng)

type Animal interface {
	speck()
}

type Dog struct {}

// compile sẽ tự hiểu Dog implement phương thức của Aminal
func (d Dog) speck() {
	fmt.Println("gâu gâu")
}

// multiple interface
type Movement interface {
	move()
}

// embed interface
type EmbedAniamal interface {
	Animal
	Movement
}

func (d Dog) move() {
	fmt.Println("4 chan")
}

// empty interface
type Data struct {
	index int
}

func emptyInterface(i interfact{}) {
	fmt.Println(i)
}


func main() {
	var embedAminal EmbedAniamal
	embedAminal = Dog{}
	embedAminal.move()
	embedAminal.speck()

	data := Data{100}

	emptyInterface(10)
	emptyInterface(10.5)
	emptyInterface(data)
}
```
