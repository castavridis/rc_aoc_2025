/**
  "Due to newer security protocols, please use password method 0x434C49434B until further notice."

  You remember from the training seminar that "method 0x434C49434B" means you're actually supposed to count the number of times any click causes the dial to point at 0, regardless of whether it happens during a rotation or at the end of one.
*/

import { readFileSync } from 'fs'

const lines: string[] = readFileSync('./inputs/01.txt', 'utf-8').split('\n')

const max = 99 + 1 // Add one because we have 0-99 = 100 steps
let currPos = 50 // Dial starts by pointing at 50
let oldPos = currPos
let clicks = 0
const regex = /^(?<dir>[RL])(?<dist>\d+)$/ // TIL: (?<NAME_HERE>...) is a named capture group

for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(regex)
  if (match?.groups) {
    const { dir, dist } = match.groups
    if (dir !== "R" && dir !== "L") {
      console.warn(`Line ${i} (${lines[i]}) has an invalid direction.`)
      continue
    }
    const _dist = parseInt(dist)
    if (dist != _dist.toString()) {
      console.warn(`Line ${i} (${lines[i]}) distance seems to be malformed.`)
      continue
    }

    // Some distances are > 100, a distance that is a multiple of 100 is 
    // equal to not moving at all
    // But counts as at least one full-rotation
    // Check how many full rotations we have and add to clicks
    if (_dist >= max) {
      // The number of times we pass zero without any calculations due to full rotations
      // If _dist = 316, expect 3 full_rotations
      const full_rotations = Math.floor(_dist / max)
      clicks += full_rotations
    }
    
    // After considering full_rotations, get the remainder
    const remainder = _dist % max
    if (remainder === 0) {
      console.info(`Line ${i} (${lines[i]}) remainder = 0, accounted for in full_rotations.`)
      continue
    }
    oldPos = currPos
    if (dir === "R") { // right (toward higher numbers)
      // Full rotations accounted for, if the remainder goes past max - 1, aka 99, we've passed or reached 0, log a click
      currPos = (oldPos + remainder) % max
      if (currPos === 0) {
        clicks++
      } else if ((oldPos + remainder) > (max - 1)) {
        // Don't count oldPos clicks?
        // if (oldPos !== 0) {
          clicks++
        // }
      }
    } else { // left (toward lower numbers)
      currPos = oldPos - remainder
      if (currPos === 0) {
        // In the less likely event currPos is now 0
        clicks++
      } else if (currPos < 0) { 
        // If < 0, the dial did pass 0 but isn't currently 0
        currPos = currPos + max
        // Don't count oldPos clicks
        if (oldPos !== 0) {
          clicks++
        }
      }
    }
    // if (dir == "R") {
    //   console.log(oldPos, "\t--", dir, dist, "–>\t", currPos, "\t", clicks)
    // } else {
    //   console.log(oldPos, "\t<-", dir, dist, "–-\t", currPos, "\t", clicks)
    // }
  } else {
    console.warn(`Line ${i} (${lines[i]}) was skipped.`)
  }
}
console.info(clicks)
