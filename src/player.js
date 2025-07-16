import { createGameboard } from "../src/gameboard";
import { createShip } from "../src/ship";

const player = (isComputer = false) => {
    // This is the attack method for a human player.
    const humanAttack = (board, coord) => {
        const [x, y] = coord;
        return board.receiveAttack(x, y);
    };

    // This is the attack method for a computer player.
    const computerAttack = (board) => {
        let x, y;

        // Keep generating random coordinates until an empty one is found.
        do {
            x = getRandomInclusive(0, 9);
            y = getRandomInclusive(0, 9);
        } while (board.getBoard()[x][y] !== null); // Use getBoard() to check state

        return board.receiveAttack(x, y);
    };

    // Return an object with a single `attack` method.
    // The function assigned to `attack` depends on the `isComputer` flag.
    return {
        attack: isComputer ? computerAttack : humanAttack,
    };
};

export { player }

function getRandomInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}