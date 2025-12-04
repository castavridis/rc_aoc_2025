import { readFileSync } from 'fs'

let totalJoltage = 0
type JoltageType = [number, number]
function findLargestJoltage(bank:string) {
  const charArr = bank.split('')
  let largest: JoltageType = [0,-1]
  let secondLargest: JoltageType = [0,-1]
  charArr.forEach((char, i) => {
    const _char = parseInt(char)
    if (_char > largest[0]) {
      if (i < charArr.length - 1) {
        largest = [_char, i]
        secondLargest = [parseInt(charArr[i+1]), i+1]
      }
      if (i == charArr.length - 1) {
        secondLargest = [parseInt(charArr[i]), charArr.length]
      }
    } else if (_char > secondLargest[0]) {
      if (i > largest[1]) {
        secondLargest = [_char, i]
      }
    }
  })
  totalJoltage += parseInt(
    `${largest[0]}${secondLargest[0]}`
  )
}

console.time()
readFileSync('./inputs/05.txt','utf-8').split('\n').map(findLargestJoltage)
console.log(totalJoltage)
console.timeEnd()
