---
sidebar_position: 4
---

```go
package main

import "fmt"

func main(){
	// Khai báo array và gán giá trị cho array
	var myArray [3]int
	myArray[0] = 1
	myArray[1] = 2
	myArray[2] = 3

	// Khai báo array có giá trị
	myArray1 := [3]int {1, 2, 3}

	// Khai báo mảng không cần sizw
	myArray2 : =[...]int {1, 2, 3, 4}

	// loop trong array
	for i :=0; len(myArray2); i++ {
		fmt.Println(myArray2[i])
	}

	for index, _ := range myArray2 {
		fmt.Println(inddex)
	}

	// array là value type không phải là ref type
	countries := [...]string {"VN", "JP"}
	copyCountries := countries

	copyCountries[0] = "THAI"

	fmt.Println(countries)      // [VN, JP]
	fmt.Println(copyCountries)  // [THAI, JP]

	// matrix arry

	matrixArray := [2][2]int {
		{1,2},
		{2,3}
	}
}
```
