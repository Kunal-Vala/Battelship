const player = (isComputer = false) => {
    // This is the attack method for a human player.
    const humanAttack = (board, coord) => {
        // FIX: Use clear variable names (row, col)
        const [row, col] = coord;
        return board.receiveAttack(row, col);
    };

    // This is the attack method for a computer player.
    const computerAttack = (board) => {
        let row, col;

        // Keep generating random coordinates until an empty one is found.
        do {
            row = getRandomInclusive(0, 9);
            col = getRandomInclusive(0, 9);
        } while (board.getBoard()[row][col] !== null); // Use (row, col)

        return board.receiveAttack(row, col);
    };

    return {
        attack: isComputer ? computerAttack : humanAttack,
    };
};

function getRandomInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export { player };
