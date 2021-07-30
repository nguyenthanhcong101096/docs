---
sidebar_position: 7
---

```go
package main

import "fmt"

func main(){
	//Khai báo map
	var myMap = make(map[string]int)
	var mayMap1 map[string]int

	// Khai báo map có giá trị
	myMap3 := map[string]int {"key1": 1, "key2": 2}

	// Thêm phần tử vào map
	myMap3["key3"] = 3
	myMap3["key4"] = 4

	// Xoá phần tử
	delete(myMap3, "key4")

	// Map là reference key
	myMap4 := map[string]int {"key1": 1, "key2": 2}
	myMap5 := myMap4

	myMap5["key2"] = 3
	// output myMap4: {"key1": 1, "key2": 3}

	// Truy cập phần tử trong Map
	value, found := myMap5["key2"]
	if found {
		// Tồn tại
	} else {
		// Không tồn tại
	}
}
```
