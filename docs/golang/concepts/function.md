---
sidebar_position: 11
---

```go
package main

import "fmt"

//func func_name (params) return_type { //code }
func helloNoParams() {
	fmt.Println("Hello world")
}

func helloWithParams(name string) {
	fmt.Println("hello", name)
}

func greetString(name string) string {
	result := fmt.Sprintf("Hello %s", name)
	return result
}

// Multiple return values
func multipleReturnValues(w, h int) (int, int, int) {
	area := w * h
	return w, h, area
}

// Named return values
func namedReturnValues(w, h int) (width int, height int, isSquare bool) {
	isSquare = w == h
	return w, h, isSquare
}

func main() {
	helloWithParams("cong")

	//=====================//
	result := greetString("lien")
	fmt.Println(result)

	//=====================//
	w, h, area := multipleReturnValues(200, 400)
	fmt.Println("width = ", w)
	fmt.Println("heigth = ", h)
	fmt.Println("area = ", area)

	//=====================//
	w1, h1, isSquare := namedReturnValues(200, 200)

	if isSquare {
		fmt.Println("this is square")
	} else {
		fmt.Println("width = ", w1)
		fmt.Println("heigth = ", h1)
	}
}
```

- Variadic function bản chất nó là 1 func trong golang

```go
package main

import "fmt"

// Nhận vào vô số tham số mà không cần giới hạn than số là bao nhiêu
func addItem(item int, list ...int) {
	// 100 200 300 -> slice int[] {100 200 300 }
	list = append(list, item)
}

func main() {
	addItem(1, 100,200,3000)

	list := []int {1,1,2,2}
	addItem(100, list...)
}
```
