# Hangman in Next.js

A classic Hangman word-guessing game refactored from plain HTML/CSS/JavaScript into a **React** component-based application using **Next.js 15**.

---

## What the Game Does

1. Enter a secret word (hidden as you type) — or click **Generate Word** to get a random one
2. Guess one letter at a time using the on-screen keyboard or your physical keyboard
3. Each wrong guess costs a life — you start with **6 lives**
4. The hangman drawing updates with every wrong guess
5. Guess the full word before running out of lives to win!

---

## Tech Stack

- **Next.js 15** — framework and routing
- **React 19** — UI and state management
- **CSS** — styling
- **JavaScript** — no TypeScript

---

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the local development server |
| `npm run build` | Build the app for production       |
| `npm run start` | Run the production build           |
