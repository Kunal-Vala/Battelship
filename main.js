// --- IMPORTS ---
import { player } from './player.js';
import { createGameboard } from './gameboard.js';
import { createShip } from './ship.js';

// --- DOM ELEMENT CACHE ---
const playerBoardElement = document.getElementById('player-board');
const computerBoardElement = document.getElementById('computer-board');
const messageElement = document.getElementById('game-message');


const renderBoard = (boardElement, gameboard, isEnemy) => {
    boardElement.innerHTML = '';
    const board = gameboard.getBoard();
    const fragment = document.createDocumentFragment();

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;

            // FIX: Use board[y][x] (row, column) for correct rendering.
            const cellState = board[y][x];

            if (cellState === 'hit') {
                cell.classList.add('hit');
            } else if (cellState === 'miss') {
                cell.classList.add('miss');
            } else if (cellState !== null && !isEnemy) {
                cell.classList.add('ship');
            }
            fragment.appendChild(cell);
        }
    }
    boardElement.appendChild(fragment);
};


// FIX: Make this an IIFE by adding () at the end.
const gameController = (() => {
    let human;
    let computer;
    let humanBoard;
    let computerBoard;
    let isPlayerTurn = true;
    let isGameOver = false;

    // FIX: Moved helper functions inside the controller for better scope management.
    const placeShips = (board) => {
        const shipsToPlace = [5, 4, 3, 3, 2];
        shipsToPlace.forEach(length => {
            let placed = false;
            while (!placed) {
                try {
                    const ship = createShip(length);
                    const x = Math.floor(Math.random() * 10);
                    const y = Math.floor(Math.random() * 10);
                    const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
                    // Pass coordinates as (row, col) which is (y, x)
                    board.placeShip(ship, y, x, orientation);
                    placed = true;
                } catch (error) {
                    // If placement fails, the loop will simply try again
                }
            }
        });
    };

    const updateMessage = (msg) => {
        messageElement.textContent = msg;
    };

    const setupGame = () => {
        human = player(false);
        computer = player(true);
        humanBoard = createGameboard();
        computerBoard = createGameboard();

        placeShips(humanBoard);
        placeShips(computerBoard);

        renderBoard(playerBoardElement, humanBoard, false);
        renderBoard(computerBoardElement, computerBoard, true);

        computerBoardElement.addEventListener('click', handlePlayerAttack);

        updateMessage("Your turn. Attack the enemy!");
    };

    const handlePlayerAttack = (e) => {
        if (!isPlayerTurn || isGameOver || !e.target.classList.contains('cell')) return;

        const x = parseInt(e.target.dataset.x, 10);
        const y = parseInt(e.target.dataset.y, 10);

        if (computerBoard.getBoard()[y][x] === 'hit' || computerBoard.getBoard()[y][x] === 'miss') {
            return;
        }
        
        // Pass coordinates as (row, col) which is (y, x)
        human.attack(computerBoard, [y, x]);
        renderBoard(computerBoardElement, computerBoard, true);

        if (computerBoard.allShipsSunk()) {
            endGame(true);
            return;
        }

        isPlayerTurn = false;
        updateMessage("Computer's turn...");
        setTimeout(computerTurn, 1000);
    };

    const computerTurn = () => {
        if (isGameOver) return;

        computer.attack(humanBoard);
        renderBoard(playerBoardElement, humanBoard, false);

        if (humanBoard.allShipsSunk()) {
            endGame(false);
            return;
        }

        isPlayerTurn = true;
        updateMessage("Your turn. Attack the enemy!");
    };

    const endGame = (playerWon) => {
        isGameOver = true;
        const winnerMessage = playerWon ? "You win! Congratulations!" : "The computer wins.";
        updateMessage(winnerMessage);
        computerBoardElement.removeEventListener('click', handlePlayerAttack);
    };

    // The setupGame function is now returned as part of the public API
    return { setupGame };
})(); // <-- The () here executes the function, starting the controller.

// --- KICK OFF THE GAME ---
gameController.setupGame();
