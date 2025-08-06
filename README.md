# React Tetris

A classic Tetris game built from the ground up with React, TypeScript, and Tailwind CSS. This project showcases the use of modern React features like Hooks to manage complex game state and logic in a clean, functional, and organized way.

## 🚀 Features

-   **Classic Tetris Gameplay**: Move and rotate falling tetrominos to complete horizontal lines.
-   **Scoring System**: Earn points for clearing single, double, triple, or "Tetris" (4) lines.
-   **Dynamic Difficulty**: The game speed increases as you level up by clearing more lines.
-   **Responsive Design**: The game layout adapts to different screen sizes, though it's optimized for keyboard input.
-   **Clean UI**: A minimalist, retro-inspired interface styled with Tailwind CSS.
-   **Modern Tech Stack**: Built with a clean, typed, and maintainable codebase using TypeScript and React Hooks.

## 🛠️ Tech Stack

-   **Frontend:** [React](https://reactjs.org/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`)

## 📦 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/en/) (which includes npm) installed on your computer.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/tieubochet/tetris_game.git
    cd tetris_game
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    The project is set up to run in an online development environment that handles the build process automatically. If you wish to run it locally, you would typically use a command like:
    ```bash
    npm run dev
    ```

## 🎮 How to Play

Use your keyboard to control the pieces. The controls are displayed in the game UI.

-   **Up Arrow (`↑`)**: Rotate the tetromino.
-   **Left Arrow (`←`)**: Move the tetromino to the left.
-   **Right Arrow (`→`)**: Move the tetromino to the right.
-   **Down Arrow (`↓`)**: Soft drop the tetromino (move it down faster).

The goal is to clear as many lines as possible and get the highest score!

## 📂 Project Structure

The codebase is organized into logical directories to keep it clean and scalable.

```
/src
├── App.tsx             # Main application component and layout
├── index.tsx           # Entry point for the React application
├── components/         # Reusable UI components (Stage, Cell, Display, etc.)
├── hooks/              # Custom React Hooks for game logic
│   ├── usePlayer.ts    # Manages player state (position, tetromino)
│   ├── useStage.ts     # Manages the game board state
│   ├── useGameStatus.ts# Manages score, level, and rows
│   └── useInterval.ts  # A declarative setInterval hook
├── services/           # Helper functions and constants
│   ├── tetrominos.ts   # Definitions for all tetromino shapes and colors
│   └── gameHelpers.ts  # Collision detection, stage creation, etc.
└── types.ts            # Shared TypeScript types and interfaces
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See the `LICENSE` file for more information (if one exists).
