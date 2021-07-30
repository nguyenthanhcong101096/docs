---
sidebar_position: 3
---

```go
package main

import "fmt"

const constant = 100

// constant emum bằng iota
const (
	red = iota
	yellow
	green
	black
)

const (
	_ = iota + 5 // bỏ gía trị đầu(0) thực hiện + 5 tiếp theo
	red1
	yellow1
	green1
	black1
)

func main() {
	const constant =  200

	fmt.Println(constant)
	fmt.Printf("%v, %T\n", red, red)
	fmt.Printf("%v, %T\n", yellow, yellow)
	fmt.Printf("%v, %T\n", green, green)
	fmt.Printf("%v, %T\n", blank, black)
}
```
