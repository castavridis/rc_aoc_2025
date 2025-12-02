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

function findInvalidIds(start: number, end: number): void {
  for (let test = start; test <= end; test++) {
    if (doesRepeat(test)) {
      password += test
    }
  }
}

function checkRepetitionHelper(test: string, interval: number): boolean {
  const firstSubStr = test.substring(0, interval)
  for (let i = 1; i <= (test.length/interval); i++) {
    if (firstSubStr !== test.substring(interval * (i-1), interval * i)) {
      return false
    }
  }
  return true
}

function doesRepeat(test: number): boolean {
  let testString = test.toString()
  for (let i = 1; i <= Math.floor(testString.length/2); i++) {
    if (testString.length % i !== 0) {
      continue
    }
    if (checkRepetitionHelper(testString, i)) {
      return true
    }
  }
  return false
}

main()
