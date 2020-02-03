// add intro with character Mavis
// surfer bro
// dude. yo what's up. I'm Mavis. I'm going to freaking teach you typing!!
// first level you type three rows qwertyuiop asdfghjkl zxcvbnm
// alphabet letter
const ALPHABET = "qwertyuiopasdfghjklzxcvbnm"

document.addEventListener('DOMContentLoaded', main)

function main() {
  let letters = scramble()

  const originalKeyboard = document.getElementById('original')
  const scrambledKeyboard = document.getElementById('scrambled')

  displayScrambledKeyboard(ALPHABET, originalKeyboard)
  mappings = displayScrambledKeyboard(letters, scrambledKeyboard)

  document.addEventListener('keypress', ev => {
    handleKeyPress(ev, mappings)
  })

  document.addEventListener('keydown', ev => {
    handleKeyDown(ev, mappings)
  })
}

function scramble() {
  const letters = ALPHABET.split('')
  letters.forEach((letter, index)=> {
    const swapIndex = Math.floor(Math.random() * letters.length)
    const otherLetter = letters[swapIndex]

    letters[index] = otherLetter
    letters[swapIndex] = letter
  })

  return letters.join('')
}

function displayScrambledKeyboard(letters, targetKeyboard) {
  const [row1, row2, row3] = targetKeyboard.getElementsByClassName('row')

  // clear out the previous keyboard arrangement
  while (row1.firstChild) { row1.firstChild.remove() }
  while (row2.firstChild) { row2.firstChild.remove() }
  while (row3.firstChild) { row3.firstChild.remove() }

  // keyboard letters per row
  // 00-09 qwertyuiop
  // 10-18 asdfghjkl 
  // 19-25 zxcvbnm
  const keyMappings = {}
  for (let i = 0; i < letters.length; i++) {
    const realKeyboardLetter = ALPHABET[i]
    const scrambledKeyboardLetter = letters[i]
    keyMappings[realKeyboardLetter] = scrambledKeyboardLetter

    let row = null
    if (i <= 9) {
      row = row1
    } else if (i <= 18) {
      row = row2
    } else {
      row = row3
    }

    const element = document.createElement('div')
    element.className = 'letter'
    element.textContent = letters[i]

    row.appendChild(element)
  }

  return keyMappings
}

function handleKeyPress(ev, mappings) {
  const target = document.getElementById('target')
  const yours = document.getElementById('yours')

  if (ev.key.length !== 1) {
    return
  }

  const physicalLetter = ev.key
  let virtualLetter = mappings[physicalLetter]

  if (!virtualLetter) {
    virtualLetter = physicalLetter
  }

  console.log(ev, ev.key)

  yours.textContent += virtualLetter
}

function handleKeyDown(ev) {
  const yours = document.getElementById('yours')
  if (ev.key === "Backspace") {
    yours.textContent = yours.textContent.substr(0, yours.textContent.length - 1)
    return
  }
}
