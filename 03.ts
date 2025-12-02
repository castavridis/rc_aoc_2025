import { readFileSync } from 'fs'

const ranges: string[] = readFileSync('./inputs/03.txt','utf-8').split(',')

let password: number = 0

function main() {
  for (let i = 0; i < ranges.length; i++) {
    const terminals: string[] = ranges[i].split('-')
    findInvalidIds(
      parseInt(terminals[0]), 
      parseInt(terminals[1]),
    )
  }
  console.log(password)
}
main()

function findInvalidIds(start: number, end: number): void {
  for (let test = start; test <= end; test++) {
    if (doesRepeat(test)) {
      password += test
    }
  }
}

function doesRepeat(test: number): boolean {
  let testString = test.toString()
  if (testString.length % 2 === 1) {
    return false
  }
  const halfwayPoint = Math.floor(testString.length/2)
  let start = testString.substring(0, halfwayPoint)
  let end = testString.substring(halfwayPoint)
  return start === end
}

// Whoops, we are not trying to find palindromes...
function isPalindrome(test: number): boolean {
  let testString = test.toString()
  // 1 2 3; 3/2 = 1.5; halfway = 1
  // 1 2 3 4; 4/2 = 2; halfway = 2
  const halfwayPoint = Math.floor(testString.length/2)
  let start = testString.substring(0, halfwayPoint)
  let end = testString.substring(
    (testString.length % 2 === 1) 
      ? halfwayPoint + 1 
      : halfwayPoint
    )
  let start2 = ""
  for (let i = end.length; i >= 0; i--) {
    start2 += end.charAt(i)
  }
  console.log(test, halfwayPoint, start, end, start2, start === start2)
  return start === start2
}