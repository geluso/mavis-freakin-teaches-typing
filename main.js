// add intro with character Mavis
// surfer bro
// dude. yo what's up. I'm Mavis. I'm going to freaking teach you typing!!
// first level you type three rows qwertyuiop asdfghjkl zxcvbnm
// alphabet letter
// name idea: Dvowreck
const ALPHABET = "qwertyuiopasdfghjklzxcvbnm"
const PHRASES = [
  "the quick brown fox jumped over the lazy dog",
  "four score and seven years ago",
]

const BACKSPACE = '🔙'
const CURSOR_BLINK_DELAY = 600

let IS_FIRST = true

document.addEventListener('DOMContentLoaded', main)

function main() {
  generate()
  cursorBlink()

  const goButton = document.getElementById('go')
  goButton.addEventListener('click', generate)
}

function cursorBlink() {
  const cursor = document.getElementById('cursor')
  setInterval(_ => {
    console.log('blink')
    if (cursor.style.visibility === 'hidden') {
      cursor.style.visibility = 'visible'
    } else {
      cursor.style.visibility = 'hidden'
    }
  }, CURSOR_BLINK_DELAY)
}

function generate() {
  let slider = document.getElementById('difficulty')
  let difficulty = slider.value
  difficulty = parseInt(difficulty, 10) / parseInt(slider.max, 10)

  let letters = scramble(difficulty)

  const originalKeyboard = document.getElementById('original')
  const scrambledKeyboard = document.getElementById('scrambled')

  displayScrambledKeyboard(ALPHABET, originalKeyboard)
  mappings = displayScrambledKeyboard(letters, scrambledKeyboard)

  let pressHandler = ev => handleKeyPress(ev, mappings)
  let downHandler = ev => handleKeyDown(ev, mappings)

  // TODO find out how to remove handlers to prevent multiple keypress readings
  document.removeEventListener('keypress', pressHandler)
  document.addEventListener('keypress', pressHandler)

  document.removeEventListener('keypress', downHandler)
  document.addEventListener('keydown', downHandler)

  if (!IS_FIRST) {
    initTimer()
  }
}

function scramble(difficulty) {
  const letters = ALPHABET.split('')
  letters.forEach((letter, index)=> {
    // only swap letters if they are within the current difficulty
    // affects only how many letters are swapped, not WHAT letters are swapped
    if (Math.random() > difficulty) {
      return
    }

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

    // highlight letters that have been swapped
    if (realKeyboardLetter !== scrambledKeyboardLetter) {
      element.classList.add('swapped')
    }

    element.addEventListener('click', _ => {
      handleKeyPress({key: ALPHABET[i]}, keyMappings)
    })

    row.appendChild(element)
  }

  // append virtual backspace button
  const backspace = document.createElement('div')
  backspace.className = 'letter backspace'
  backspace.textContent = BACKSPACE

  backspace.addEventListener('click', _ => {
    handleKeyDown({key: BACKSPACE}, keyMappings)
  })

  row1.appendChild(backspace)
  
  // attach click listener to virtual space button
  const space = document.getElementById('space')
  space.addEventListener('click', _ => {
    handleKeyPress({key: ' '}, keyMappings)
  })

  return keyMappings
}

function handleKeyPress(ev, mappings) {
  if (IS_FIRST) {
    IS_FIRST = false
    initTimer()
  }

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

  yours.textContent += virtualLetter
}

function handleKeyDown(ev) {
  const yours = document.getElementById('yours')
  if (ev.key === 'Backspace' || ev.key === BACKSPACE) {
    yours.textContent = yours.textContent.substr(0, yours.textContent.length - 1)
    return
  }
}

function initTimer() {
  const timer = document.getElementById('timer')
  const start = (new Date()).getTime()

  const intervalId = setInterval(() => {
    const target = document.getElementById('target')
    const yours = document.getElementById('yours')

    if (target.textContent === yours.textContent) {
      clearInterval(intervalId)
    }

    const now = (new Date()).getTime()
    const delta = now - start

    const thousands = Math.floor(delta / 1000)
    const decimal = delta % 1000

    timer.textContent = thousands + '.' + decimal
  })
}
