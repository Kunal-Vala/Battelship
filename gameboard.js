import { createShip } from "./ship.js";

const createGameboard = () => {
    const gameboard = Array(10).fill(null).map(() => Array(10).fill(null));
    const ships = [];

    // FIX: Standardize on (row, col) for clarity.
    const placeShip = (ship, row, col, orientation) => {
        // A. BOUNDS CHECK
        if (orientation === 'horizontal' && col + ship.length > 10) {
            throw new Error('Ship is out of bounds.');
        }
        if (orientation === 'vertical' && row + ship.length > 10) {
            throw new Error('Ship is out of bounds.');
        }

        // B. COLLISION CHECK
        for (let i = 0; i < ship.length; i++) {
            if (orientation === 'horizontal') {
                if (gameboard[row][col + i] !== null) {
                    throw new Error('Ship overlaps with another ship.');
                }
            } else { // 'vertical'
                if (gameboard[row + i][col] !== null) {
                    throw new Error('Ship overlaps with another ship.');
                }
            }
        }

        // --- 2. PLACEMENT ---
        for (let i = 0; i < ship.length; i++) {
            if (orientation === 'horizontal') {
                gameboard[row][col + i] = ship;
            } else { // 'vertical'
                gameboard[row + i][col] = ship;
            }
        }
        ships.push(ship);
    };

    const getBoard = () => {
        return gameboard;
    };

    // FIX: Standardize on (row, col) for clarity.
    const receiveAttack = (row, col) => {
        const target = gameboard[row][col];

        if (target === 'hit' || target === 'miss') {
            return 'already attacked';
        }

        if (target === null) {
            gameboard[row][col] = 'miss';
            return 'miss';
        }

        target.hit();
        gameboard[row][col] = 'hit';
        return 'hit';
    };

    const allShipsSunk = () => {
        return ships.every(ship => ship.isSunk());
    };

    const getMissedAttacks = () => {
        const missedCoordinates = [];
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                if (gameboard[row][col] === 'miss') {
                    missedCoordinates.push([row, col]);
                }
            }
        }
        return missedCoordinates;
    };

    return {
        placeShip,
        getBoard,
        receiveAttack,
        allShipsSunk,
        getMissedAttacks,
    };
};

export { createGameboard };
