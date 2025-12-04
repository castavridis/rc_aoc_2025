import { readFileSync } from 'fs'
let _rows = readFileSync('./inputs/07.txt','utf-8').split('\n')
const maxRollsAllowed = 4
const recentRemovalChar = "X"
let prevChars, currChars, nextChars
let accessiblePaperRolls = 0
let removalIterations = 0

/**
  The forklifts can only access a roll of paper if there are fewer than four rolls of paper in the eight adjacent positions. Roll of paper = @
 */
type Position = [number, number] // [r,c]
type CardinalDirection = 'n' | 'e' | 's' | 'w'
type InterCardinalDirection = 'ne' | 'se' | 'sw' | 'nw' 
type CheckType = Record<CardinalDirection | InterCardinalDirection, boolean>
function findAccessiblePaperRolls (rows: string[]) {
  const printOutput = []
  let shouldRemoveMore = false
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
    currChars.map((_col, c) => {
      check.e = c < currChars.length - 1
      check.w = c > 0
      check.ne = check.n && check.e 
      check.se = check.s && check.e
      check.sw = check.s && check.w
      check.nw = check.n && check.w
      const result = printCheck([r,c], check)
      printableRow.push(result)
      if (result === recentRemovalChar) {
        shouldRemoveMore = true
      }
    })
    printOutput.push(printableRow.join(""))
  })
  if (shouldRemoveMore) {
    removalIterations++
    // console.log(rows.join("\n"))
    findAccessiblePaperRolls(printOutput)
  }
}
function foundRoll(char: string): number {
  return (char == "@") ? 1 : 0
}
function printCheck(position: Position, check: CheckType) {
  let adjRolls = 0
  let _currChars = [...currChars]
  _currChars[position[1]] = "?"
  function updateLog (logPos: Position, found: number) {
    adjRolls += found
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
      && adjRolls < maxRollsAllowed) {
        accessiblePaperRolls++
        return recentRemovalChar
  }
  if (currChars[position[1]] === recentRemovalChar) {
    return "."
  }
  return currChars[position[1]]
}

console.time()
findAccessiblePaperRolls(_rows)
console.log(`Could not remove more after: ${removalIterations} iterations.`)
console.log(`Accessible paper rolls: ${accessiblePaperRolls}.`)
console.timeEnd()