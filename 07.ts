import { readFileSync } from 'fs'
const rows = readFileSync('./inputs/07.txt','utf-8').split('\n')
const printOutput = []
const maxRollsAllowed = 4
let prevChars, currChars, nextChars
let accessiblePaperRolls = 0

/**
  The forklifts can only access a roll of paper if there are fewer than four rolls of paper in the eight adjacent positions. Roll of paper = @
 */
type Position = [number, number] // [r,c]
type CardinalDirection = 'n' | 'e' | 's' | 'w'
type InterCardinalDirection = 'ne' | 'se' | 'sw' | 'nw' 
type CheckType = Record<CardinalDirection | InterCardinalDirection, boolean>
function findAccessiblePaperRolls () {
  rows.map((row, r) => {
    prevChars = (r > 0) ? rows[r - 1].split("") : null
    currChars = row.split("")
    nextChars = (r < rows.length - 1) ? rows[r + 1].split("") : null
    const printableRow = []
    const check: CheckType  = {
      n: (prevChars != null),
      ne: false,
      e: false,
      se: false,
      s: (nextChars != null),
      sw: false,
      w: false,
      nw: false,
    }
    currChars.map((col, c) => {
      check.e = c < currChars.length - 1
      check.w = c > 0
      check.ne = check.n && check.e 
      check.se = check.s && check.e
      check.sw = check.s && check.w
      check.nw = check.n && check.w
      printCheck([r,c], check)
      if (col === "@" && canFetch([r, c], check)) {
        printableRow.push("X")
        // accessiblePaperRolls++
      } else {
        printableRow.push(col)
      }
    })
    printOutput.push(printableRow.join(""))
  })
}
function foundRoll(char: string): number {
  return (char == "@") ? 1 : 0
}
/*
  ? ? ?
  ? @ ?
  ? ? ?
 */
function canFetch(position: Position, check: CheckType): boolean {
  let rollsFound = 0
  let ei = (check.e) ? position[1] + 1 : -1
  let wi = (check.w) ? position[1] - 1 : -1
  let ni = (check.n) ? position[0] : -1
  let si = (check.s) ? position[0] : -1
  if (check.n) {
    rollsFound += foundRoll(prevChars[ni])
    if (check.ne) rollsFound += foundRoll(prevChars[ei])
    if (check.nw) rollsFound += foundRoll(prevChars[wi])
  }
  if (check.e) rollsFound += foundRoll(currChars[ei])
  if (check.s) {
    rollsFound += foundRoll(nextChars[si])
    if (check.se) rollsFound += foundRoll(nextChars[ei])
    if (check.sw) rollsFound += foundRoll(nextChars[wi])
  }
  if (check.w) rollsFound += foundRoll(currChars[wi])
  return (rollsFound < maxRollsAllowed)
}

function printCheck(position: Position, check: CheckType) {
  let adjRolls = 0
  let _currChars = [...currChars]
  _currChars[position[1]] = "?"
  const wtf = (wtf: boolean) => wtf ? "T" : "F"
  const wtfRows = [
    [wtf(check.nw),wtf(check.n),wtf(check.ne)],
    [wtf(check.w),"?",wtf(check.e)],
    [wtf(check.sw),wtf(check.s),wtf(check.se)],
  ]
  const printRows = [
    ["–","–","–"],
    ["|",currChars[position[1]],"|"],
    ["–","–","–"],
  ]
  function updateLog (logPos: Position, found: number) {
    adjRolls += found
    printRows[logPos[0]][logPos[1]] = (found === 1) ? "x" : "."
  }
  let ei = (check.e) ? position[1] + 1 : -1
  let wi = (check.w) ? position[1] - 1 : -1
  let ni = (check.n) ? position[1] : -1
  let si = (check.s) ? position[1] : -1
  if (check.n) {
    updateLog([0,1], foundRoll(prevChars[ni]))
    if (check.ne) updateLog([0,2], foundRoll(prevChars[ei]))
    if (check.nw) updateLog([0,0], foundRoll(prevChars[wi]))
  }
  if (check.e) updateLog([1,2], foundRoll(currChars[ei]))
  if (check.s) {
    updateLog([2,1], foundRoll(nextChars[si]))
    if (check.se) updateLog([2,2], foundRoll(nextChars[ei]))
    if (check.sw) updateLog([2,0], foundRoll(nextChars[wi]))
  }
  if (check.w) updateLog([1,0], foundRoll(currChars[wi]))
  if (currChars[position[1]] === "@" 
      && adjRolls < maxRollsAllowed) accessiblePaperRolls++

  // console.log(`${position}\t${printRows[0].join(" ")}\t${wtfRows[0].join(" ")}\t${prevChars ? prevChars.join(" ") : ""}`)
  // console.log(`\t${printRows[1].join(" ")}\t${wtfRows[1].join(" ")}\t${_currChars.join(" ")}`)
  // console.log(`${adjRolls}>${accessiblePaperRolls}\t${printRows[2].join(" ")}\t${wtfRows[2].join(" ")}\t${nextChars ? nextChars.join(" ") : ""}\n`)
}

console.time()
findAccessiblePaperRolls()
console.timeEnd()
console.log(`Accessible paper rolls: ${accessiblePaperRolls}`)
// console.log(printOutput.join("\n"))