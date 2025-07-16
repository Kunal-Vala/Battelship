import { createGameboard } from "../src/gameboard";
import { createShip } from "../src/ship";
import { player } from "../src/player";

describe('Player', () => {
    let gameboard;
    let humanPlayer;

    beforeEach(() => {
        gameboard = createGameboard();
        // Create a human player (isComputer defaults to false)
        humanPlayer = player();
    });

    test('human can attack the enemy board', () => {
        const ship = createShip(3);
        gameboard.placeShip(ship, 0, 0, 'horizontal');
        const coord = [0, 0];
        const result = humanPlayer.attack(gameboard, coord);

        expect(result).toBe('hit');
        const boardState = gameboard.getBoard();
        expect(boardState[0][0]).toBe('hit');
    });
});

describe('BOT', () => {
    let gameboard;
    let bot;

    beforeEach(() => {
        gameboard = createGameboard();
        // **FIX:** Create a computer player by passing true
        bot = player(true);
    });

    test('makes a valid random attack on the board', () => {
        // Act: Have the bot attack the empty board.
        // The bot's `attack` method now correctly points to the random attack logic.
        bot.attack(gameboard);

        // Assert: Check that one spot is now a 'miss'
        const missedAttacks = gameboard.getMissedAttacks();
        expect(missedAttacks.length).toBe(1);
    });

    test('does not attack the same spot twice', () => {
        // Arrange: Fill up the entire board except for one spot
        const boardState = gameboard.getBoard();
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                // Leave just one spot, e.g., [5, 5], as null
                if (x !== 5 || y !== 5) {
                    boardState[x][y] = 'miss';
                }
            }
        }

        // Act: The bot's only valid move is to attack [5, 5]
        bot.attack(gameboard);

        // Assert: Check that the last remaining spot was hit
        expect(boardState[5][5]).toBe('miss');
    });
});
