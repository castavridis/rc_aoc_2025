import { readFileSync } from 'fs';

const lines: string[] = readFileSync('./inputs/01.txt', 'utf-8').split('\n');

const max = 99 + 1 // Add one because we have 0-99 = 100 steps
let currPos = 50 // Dial starts by pointing at 50
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
    if (dist != parseInt(dist).toString()) {
      console.warn(`Line ${i} (${lines[i]}) distance seems to be malformed.`)
      continue
    }

    // Some distances are > 100, a distance of 100 is equal to not moving at all
    // So get the modulo of the max
    const mod_dist = parseInt(dist) % max
    if (dir === "R") { // right (toward higher numbers)
      currPos = (currPos + mod_dist) % max
    } else { // left (toward lower numbers) 
      currPos = currPos - mod_dist
      if (currPos < 0) {
        currPos = currPos + max
      }
    }
    if (currPos === 0) {
      clicks++;
    }
  } else {
    console.warn(`Line ${i} (${lines[i]}) was skipped.`)
  }
}
console.info(clicks)
