'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

async function getRandomWord() {
  const length = Math.floor(Math.random() * 4) + 3;
  try {
    const response = await fetch(
      `https://random-word-api.vercel.app/api?words=1&length=${length}`
    );
    const [word] = await response.json();
    return String(word || '').toLowerCase();
  } catch {
    const fallbackByLength = {
      3: ['cat', 'dog', 'sun', 'sky', 'ice'],
      4: ['book', 'tree', 'moon', 'jazz', 'code'],
      5: ['happy', 'smile', 'dance', 'light', 'beach'],
      6: ['garden', 'planet', 'kitten', 'silver', 'python'],
    };
    const pool = fallbackByLength[length] || Object.values(fallbackByLength).flat();
    return pool[Math.floor(Math.random() * pool.length)];
  }
}

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default function HangmanGame() {
  const [screen, setScreen] = useState('input');
  const [secretWord, setSecretWord] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [lives, setLives] = useState(6);
  const [gameOver, setGameOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const inputRef = useRef(null);

  const hangmanStage = Math.min(wrongGuesses.length, 6);
  const isWon =
    secretWord.length > 0 &&
    secretWord.split('').every((l) => guessedLetters.includes(l));
  const isLost = lives === 0;

  const wordDisplay = secretWord
    .split('')
    .map((l) => (guessedLetters.includes(l) ? l : '_'))
    .join(' ');

  const hangmanSrc = isWon
    ? '/images/Hangman-win.png'
    : `/images/hangman-${hangmanStage}.png`;

  // Set gameOver when win or loss is detected
  useEffect(() => {
    if (screen !== 'game' || secretWord.length === 0 || gameOver) return;
    if (isWon || isLost) {
      setGameOver(true);
    }
  }, [isWon, isLost, screen, secretWord, gameOver]);

  const handleGuess = useCallback(
    (letter) => {
      if (gameOver) return;
      if (guessedLetters.includes(letter) || wrongGuesses.includes(letter)) return;

      if (secretWord.includes(letter)) {
        setGuessedLetters((prev) => [...prev, letter]);
      } else {
        setWrongGuesses((prev) => [...prev, letter]);
        setLives((prev) => prev - 1);
      }
    },
    [gameOver, guessedLetters, wrongGuesses, secretWord]
  );

  // Physical keyboard support
  useEffect(() => {
    if (screen !== 'game') return;
    const handleKeyDown = (e) => {
      const letter = e.key.toLowerCase();
      if (/^[a-z]$/.test(letter)) {
        handleGuess(letter);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [screen, handleGuess]);

  function startGame(word) {
    if (!word || !/^[a-z]+$/.test(word)) {
      alert('Please enter a valid word with only letters.');
      return;
    }
    setSecretWord(word);
    setGuessedLetters([]);
    setWrongGuesses([]);
    setLives(6);
    setGameOver(false);
    setScreen('game');
  }

  function handleRestart() {
    setGuessedLetters([]);
    setWrongGuesses([]);
    setLives(6);
    setGameOver(false);
  }

  function handleNewGame() {
    setGuessedLetters([]);
    setWrongGuesses([]);
    setLives(6);
    setGameOver(false);
    setSecretWord('');
    setInputValue('');
    setScreen('input');
    setTimeout(() => inputRef.current?.focus(), 10);
  }

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const word = await getRandomWord();
      startGame(word);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate word. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <img
        src="/Hangman-Title/hangman-title.png"
        alt="Hangman Title"
        id="titleImage"
      />

      <div id="hangmanVisual">
        <img
          id="hangmanImage"
          src={hangmanSrc}
          alt="Hangman Drawing"
        />
      </div>

      {screen === 'input' && (
        <div id="wordInputSection">
          <h2>Enter a word</h2>
          <input
            type="password"
            id="secretWordInput"
            placeholder="Type a word"
            autoComplete="off"
            data-lpignore="true"
            autoFocus
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') startGame(inputValue.toLowerCase().trim());
            }}
          />
          <div className="button-group">
            <button id="generateWord" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Word'}
            </button>
            <button
              id="startGame"
              onClick={() => startGame(inputValue.toLowerCase().trim())}
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {screen === 'game' && (
        <div id="game">
          <div id="controls">
            <button id="restartGame" onClick={handleRestart}>
              Restart
            </button>
            <button id="newGame" onClick={handleNewGame}>
              New Game
            </button>
          </div>

          <p id="wordDisplay">
            {isLost
              ? `🥴 Oof.. Try again? The word was: ${secretWord}`
              : isWon
              ? '😄 Nice one! You saved him!'
              : wordDisplay}
          </p>
          <p className="status">
            Wrong guesses:{' '}
            <span id="wrongGuessesDisplay">{wrongGuesses.join(' ')}</span>
          </p>
          <p className="status">
            Lives left: <span id="livesDisplay">{lives}</span>
          </p>

          <div id="keyboard">
            {LETTERS.map((letter) => {
              const isCorrect = guessedLetters.includes(letter);
              const isWrong = wrongGuesses.includes(letter);
              return (
                <button
                  key={letter}
                  disabled={isCorrect || isWrong || gameOver}
                  onClick={() => handleGuess(letter)}
                  style={
                    isCorrect
                      ? { backgroundColor: '#27ae60' }
                      : isWrong
                      ? { backgroundColor: '#c0392b' }
                      : undefined
                  }
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
