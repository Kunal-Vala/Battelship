import { createShip } from "./ship";


const createGameboard = () => {
    // This is the actual grid
    const gameboard = Array(10).fill(null).map(() => Array(10).fill(null));
    const ships = [];

    const placeShip = (ship, x, y, pos) => {
        // --- 1. VALIDATION ---
        if (pos === 'horizontal' && y + ship.length > 10) {
            throw new Error('Ship is out of bounds.');
        }
        if (pos === 'vertical' && x + ship.length > 10) {
            throw new Error('Ship is out of bounds.');
        }
        for (let i = 0; i < ship.length; i++) {
            if (pos === 'horizontal') {
                if (gameboard[x][y + i] !== null) {
                    throw new Error('Ship overlaps with another ship.');
                }
            } else { // 'vertical'
                if (gameboard[x + i][y] !== null) {
                    throw new Error('Ship overlaps with another ship.');
                }
            }
        }
        // --- 2. PLACEMENT ---
        for (let i = 0; i < ship.length; i++) {
            if (pos === 'horizontal') {
                gameboard[x][y + i] = ship;
            } else { // 'vertical'
                gameboard[x + i][y] = ship;
            }
        }
        ships.push(ship);
    };

    const getBoard = () => {

        return gameboard;
    };

    const receiveAttack = (x, y) => {
        const target = gameboard[x][y];

        if (target === 'hit' || target === 'miss') {
            return 'already attacked';
        }

        if (target === null) {
            gameboard[x][y] = 'miss';
            return 'miss';
        }

        target.hit();
        gameboard[x][y] = 'hit';
        return 'hit';
    }

    const allShipsSunk = () => {
        return ships.every(ship => ship.isSunk());
    }

    const getMissedAttacks = () => {
        const missedCoordinates = []; // Create an empty array to store results

        // Loop through each row
        for (let x = 0; x < 10; x++) {
            // Loop through each cell in the current row
            for (let y = 0; y < 10; y++) {
                if (gameboard[x][y] === 'miss') {
                    // If a miss is found, push its coordinates to the results
                    missedCoordinates.push([x, y]);
                }
            }
        }

        return missedCoordinates;
    };

    // Example result: [[3, 4], [7, 1]]
    // 2. Return the methods to make them public
    return {
        placeShip,
        getBoard,
        receiveAttack,
        allShipsSunk,
        getMissedAttacks,
        // You'll add receiveAttack, allShipsSunk, etc. here later
    };
};

export { createGameboard }