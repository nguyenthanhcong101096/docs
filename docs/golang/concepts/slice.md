---
sidebar_position: 6
---

```go
package main

import "fmt"

func main(){
 	// Khai báo slice
 	var mySlice []int

 	// Khai báo và tạo giá trị cho slice
 	var mySlice1 = []int {1,2,3,4}

 	// Tạo slice từ array
 	var myArray = [4]int {1,2,3,4}
 	mySlice2 := myArray[1:3]
 	// myArray[1:3] -> array[1] -> array[3-1] = array[2]
	// output [2,3]

 	mySlice3 = myArray[:]    // lấy toàn bộ giá trị array
 	mySlice4 = myArray[2:]   // lấy index 2 tới cuối mảng
 	myslice5 = go_module[:3] // lấy index 0 đến index(3 - 1)


 	// Tạo slice từ 1 slice khác
 	mySlice6 := []int {1,2,3,4,5,6}
 	mySlice7 := mySlice6      //output: [1,2,3,4,5,6]
	mySlice8 := mySlice6[1:]  //output: [2,3,4,5,6]

	//slice là reference type
	var myArray1 = [4]int {1,2,3,4}
	mySlice9 := myArray1[:]
	mySlice9[0] = 999
	//output myArray1 = [999,2,3,4]
	//output mySlice9 = [999,2,3,4]

	//Khái niệm len va cap
	myArray2 = [...]string {"A", "B", "C", "D", "E", "F"}
	myslice10 := myArray2[2:5]
	// len(mySlice10) -> ["C", "D", "E"] = 3 số lượng phần tử trong slice
	// cap(mySlice19) -> 4 -> vị trí start của slice (2:C) tới cuối mảng ["C", "D", "E", "F"]

	// make, copy, append
	// make -> khai báo len 2 và cap 5, không khai báo cap thì cap = len
	mySlice11 := make([]int, 2, 5)
	fmt.Println(mySlice11)
	fmt.Println(len(mySlice11))
	fmt.Println(cap(mySlice11))

	// append
	var mySlice12 []int
	mySlice12 = append(mySlice12, 100)
	fmt.Println(mySlice12)

	//copy
	src := []string {"A", "B", "C", "D"}
	dest := make([]string, 2)

	copy(dest, src)
	fmt.Println(dest)

	// delete item with index 1
	src = append(src[:1], src[2:]...) // slice - slice = append(slice1, slice2...)
}
```
