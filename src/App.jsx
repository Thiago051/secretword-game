// CSS
import './App.css'

// React
import { useCallback, useEffect, useState } from 'react'

// data 
import { wordsList } from './data/words'

// components
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' }
]

const guessesQty = 3

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState('')
  const [pickedCategory, setPickedCategory] = useState('')
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    // pick random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * categories.length)]
    // pick random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    return { word, category }
  }, [words])

  // start secret word game
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates()

    // pick word and category
    const { word, category } = pickWordAndCategory()

    // create array of letters
    let wordLetters = word.split('')
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    // fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  // process letter input
  const verifyLetter = (letter) => {
    const normalizedLatter = letter.toLowerCase()

    // check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLatter) ||
      wrongLetters.includes(normalizedLatter)
    ) {
      return
    }

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLatter)) {
      setGuessedLetters((currentGuessedLetters) => [
        ...currentGuessedLetters,
        normalizedLatter
      ])
    } else {
      setGuesses(guesses - 1)
      setWrongLetters((currentWrongLetters) => [
        ...currentWrongLetters,
        normalizedLatter
      ])
    }
  }


  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // check lose condition
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  // chek win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    // win condition
    if (
      guessedLetters.length > 0 &&
      guessedLetters.length === uniqueLetters.length
    ) {
      // add score
      setScore((currentScore) => currentScore += 100)

      // restart game with a new word
      startGame()
    }
  }, [guessedLetters, letters, startGame])

  // reestart game
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    setGameStage(stages[0].name)
  }

  return (
    <div className='App'>
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />)}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  )
}

export default App
