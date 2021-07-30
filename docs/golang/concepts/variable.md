---
sidebar_position: 2
---

```go
package main
import (
	"fmt"
	"strconv"
)

//////////// global scope /////////////
var globalScope int = 100

// export global (viết hoa chữ cái đầu)
var GlobalScope int = 100

// global block
var (
	globalScope1 int = 100
	globalScope2 int = 100
)

func main() {
		// ------------------
		// Zero value concept
		// ------------------

		// Every single value we create must be initialized. If we don't specify it, it will be set to
	  // the zero value. The entire allocation of memory, we reset that bit to 0.

		// - Boolean false
		// - Integer 0
		// - Floating Point 0
		// - Complex 0i
		// - String "" (empty string)
		// - Pointer nil

		///////////// Cú pháp khai báo 1 /////////////////
		var a int
		var aa int = 1
		aaa := 10
		var c float64
		var d bool

		fmt.Printf("var a int \t %T [%v]\n", a, a)
		fmt.Printf("var a int \t %T [%v]\n", aa, aa)
		fmt.Printf("var a int \t %T [%v]\n", aaa, aaa)
		fmt.Printf("var a int \t %T [%v]\n", lobalScope, lobalScope)

		/////////// Naming converstion Camel ///////////////
		var helloWorld string = "hellworld"
		var hellNumber int    = 100

		/////////// Convert Type /////////////////
		var integer int = 10
		var float float32 = float32(integer)
		var string string = strconv.Itoa(integer)
}
```
