import { readFileSync } from 'fs'

// Has a dynamic programming feel
// Some people reframed it as a greedy algorithm
// Keith: started from the right and looked for the largest 
// Find the lowest index of #s from 9 to 1
// Joseph impressed by conscise answers; Sarah says ruby makes it easier to be concise
// Sarah can give a how-to for dynamic programming
// Keith's hack to not construct a table is write a full recursive solution and then add memoization
// Dominick had a 12-digit window and kept looking for highest digits and saved them
// Keith took sequence chopped off last 11 to find the max and find first instance of max and start from there and then recurse, drop the last 10,9,etc
// Someone would start decreasing batteries Lakshya: monotonic decrementing

let totalJoltage = 0
const maxBatteryCount = 2
let newJoltages = []
let currBank = ""
let currChars: string[] = null
type JoltageType = [number, number] // char value, charArr index
let numRecursions = 0
function traverseJoltages(bank:string, currJoltage: JoltageType) {
  console.log("Current recursions:", numRecursions)
  // reset when we have a new bank
  if (currBank !== bank) {
    addNewJoltages("resetting bank")
    currBank = bank
    currChars = currBank.split('')
    newJoltages = []
  } 

  // note: need to make sure always adding to new joltages to reach this
  if (newJoltages.length >= maxBatteryCount) {
    addNewJoltages("Reached maxBatteryCount in traverseJoltages:")
    return
  } else {
    // initialize our current joltage
    let _currJoltage: JoltageType = currJoltage || [parseInt(currChars[0]), 0]

    // start iterating over our characters
    currChars.forEach((char, i) => {
      // skip characters that have already been reviewed
      // our current joltage should always have an index we can reference
      // our current joltage should always have an index that greater than the previous joltages
      if (i < _currJoltage[1]) { // starting condition 0 < 0 == false
        return
      }
      if (newJoltages.length >= maxBatteryCount) {
        addNewJoltages("Reached maxBatteryCount in currChars.forEach:")
        return
      }
      // if there are still characters to traverse
      if (_currJoltage[1] < currChars.length - 1) {

        // check that we should check the rest of the string
        const remainingCharCount = currChars.length - 1 - i
        const remainingJoltagesCount = maxBatteryCount - newJoltages.length
        if (remainingCharCount > 0 && remainingCharCount === remainingJoltagesCount) {
          const remainingChars = currChars.slice(i)
          remainingChars.map((char, j) => {
            if (j === 0) return
            newJoltages.push([parseInt(char), i+j])
          })
          addNewJoltages(`Remaining chars ${remainingCharCount} ${remainingJoltagesCount}:\t`)
          return
        }
    
        // check current joltage against next joltage
        const nextIndex = i + 1
        const nextVal = parseInt(currChars[nextIndex])
        if (nextVal > _currJoltage[0]) {
          // update currJoltage with this bigger value
          _currJoltage = [nextVal, nextIndex]
          newJoltages[Math.max(0, newJoltages.length - 1)] = _currJoltage
          return
        } else {
          // if nextVal < currJoltage[0], time to move on to the next slot
          newJoltages.push(_currJoltage)
          // traverseJoltages(bank, [nextVal, nextIndex])
        }
      } else {
        // addNewJoltages(`currJoltage[i] > currChars.length:\t`)
        return
      }
    })
  }
}
function addNewJoltages(source: string = "") {
  console.log(source, currBank, "==>", newJoltages)
  totalJoltage += parseInt(newJoltages.map((val) => val[0]).join(""))
}

function __findLargestJoltage(bank: string) {
  const char_arr = bank.split("")
  const joltages: string[] = new Array(maxBatteryCount).fill("0")
  let joltage_cursor = 0
  console.log("\ninput:\t", char_arr.join(""))
  char_arr.map((char, i) => {
    // We've reached the end of what is necessary to check
    // Push the rest into joltages without checking
    // Add to totalJoltage
    if (
      joltage_cursor !== maxBatteryCount - 1 // We need to check last char
      && i > maxBatteryCount 
      && (char_arr.length - 1 - i) === (maxBatteryCount - 1 - joltage_cursor)) {
      joltages.push(...char_arr.slice(i+1))
      totalJoltage += parseInt(joltages.join(""))
      return
    }
    for (let j = 0; j < maxBatteryCount; j++) {

      if (bank === "234234234234278") {
        console.log(`char[${i}]: ${char}; joltages[${j}]: ${joltages[j]}; cursor: ${joltage_cursor}`,joltages.join(""))
      }
      // Joltage cursor tracks which joltage values we should be evaluating
      if (j < joltage_cursor) { continue }

      if (parseInt(joltages[j]) < parseInt(char)) {
        joltages[j] = char
        break // move to next char and restart joltage checks
      }
      if (parseInt(joltages[j]) > parseInt(char)) {
        joltages[j+1] = char
        joltage_cursor = Math.min(j, maxBatteryCount-1)
        continue // increment joltage cursor, store char as next joltage to evaluate
      }
      // If the current joltage is the same, move the cursor
      if (parseInt(joltages[j]) === parseInt(char)) {
        joltage_cursor = Math.min(j, maxBatteryCount-1)
        continue
      }
    }
  })
  console.log("output:\t", joltages.join(""), "\n")
}

// char_arr = "818181911112111".split("")
// joltages: number[] = []

// let joltage_cursor = 0
// while j = 0; j < 16 (char_arr.length); j++
//    for i = 0; i < 12 (maxBatteryCount); i++
//      if (char_arr.length - 1 - j === maxBatteryCount - 1 - joltage_cursor) {
//        // We've effectively reached the end of our capacity, no need to check anymore
//        // Copy the rest of the chars into our joltage array
//      }
// 
//      if (joltage[i] < char_arr[i])
//        joltage[i]  = char_arr[i]
//        break (move to next char and restart voltage check)
// 
//      // If this character is less than the current joltage, move forward in the joltage array permanently
//      if (joltage[i].value > char_arr[j]) {
//        joltage_cursor = i + 1
//        // move to the next joltage to check
//        continue
//      }
// 
//      if (joltage[char_])
// 
//      joltage[0] = 8
//      joltage[0] = 8, 8 > 1, next joltage
//      joltage[1] = 1
//      joltage[1] = 8
//      joltage[2] = 1
//      joltage[2] = 8
// 
//      joltage[3] = 1
//      joltage[3] = 9
// 
//      if ((16 - 1 - j) < (maxBatteryCount - 1 - i))
//        joltage[4...11] = char_arr.slice(4)
//  i++

function _findLargestJoltage(bank: string) {
  const charArr = bank.split('')
  let joltages: JoltageType[] = []
  
  // console.log(charArr)

  // iterate over joltages
  for(let i = 0; i < maxBatteryCount; i++) {
    const currJoltage = joltages[i] ? joltages[i][0] : 0
    const currCharIndex = joltages[i] ? joltages[i][1] : -1
    // iterate over chars starting at joltage index
    for (let j = 0; j < charArr.length; j++) {
      const testJoltage = parseInt(charArr[j])
      // if joltage < current char, joltage = char
      if (currJoltage < testJoltage && currCharIndex < j) {
        joltages[i] = [testJoltage, j]
        break
      } 
      // else if (_charArr.length - j === maxBatteryCount - i) {
      //   const _finalChars = _charArr.slice(j)
      //   _finalChars.map((char, k) => {
      //     joltages.push([char, j+k])
      //   })
      //   console.log(joltages)
      //   return
      // }
    }
  }

    // subsequent joltages are overwritten
    // if (charArr.length - char_index) === (maxBatteryCount - j)
      // end iterations the rest of the joltages = end of charArray
  // if joltage > current char, go to next joltage

  console.log(joltages.join(""), bank)
  totalJoltage += parseInt(
    joltages.join("")
  )
}

// from left-to-right, check if current character is larger than first joltage
// if it is not larger than the first joltage, check if it is larger than second joltage
// if it is not larger than the second joltage, check if it is larger than third joltage...
// if it is larger than an nth joltage, set nth joltage
// when a digit is larger than nth joltage, all joltages after it must be re-evaluated
// if remaining characters is equal to n, joltages = remaining characters
// if a character is not larger than n joltages, keep traversing parent char array
// keep this example in mind: 818181911112111

console.time()
readFileSync('./inputs/05-example.txt','utf-8').split('\n').map(
  (bank: string) => traverseJoltages(bank, null)
)
console.log(totalJoltage, 3121910778619)
console.timeEnd()