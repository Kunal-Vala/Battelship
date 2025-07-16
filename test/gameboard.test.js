import { createGameboard } from "../src/gameboard";
import { createShip } from "../src/ship";

describe('Gameboard Factory', () => {
    let gameboard;

    beforeEach(() => {
        gameboard = createGameboard();  // create gamebaord before each tests
    });

    test('can place a ship at specific coordinate', () => {
        const ship = createShip(3);
        gameboard.placeShip(ship, 0, 0, 'horizontal');

        const board = gameboard.getBoard();

        expect(board[0][0]).toBe(ship);
        expect(board[0][1]).toBe(ship);
        expect(board[0][2]).toBe(ship);
        expect(board[0][3]).toBeNull();
    });

    test('records a missed attack', () => {
        expect(gameboard.receiveAttack(5, 5)).toBe('miss');
    });
    test('forwards a hit to the correct ship', () => {
        const ship = createShip(2);
        gameboard.placeShip(ship, 1, 1, 'vertical');
        gameboard.receiveAttack(1, 1);
        gameboard.receiveAttack(2, 1);
        expect(ship.isSunk()).toBe(true);
    });
    test('reports when all ships are sunk', () => {
        const ship1 = createShip(2);
        const ship2 = createShip(1);
        gameboard.placeShip(ship1, 0, 0,'horizontal');
        gameboard.placeShip(ship2, 5, 5,'vertical');

        gameboard.receiveAttack(0, 0);
        gameboard.receiveAttack(0, 1); // Ship 1 sunk
        expect(gameboard.allShipsSunk()).toBe(false);

        gameboard.receiveAttack(5, 5); // Ship 2 sunk       
        expect(gameboard.allShipsSunk()).toBe(true);
    });
});


describe('getMissedAttacks', () => {
    let gameboard;

    beforeEach(() => {
        gameboard = createGameboard();
    });

    test('should return an empty array when there are no misses', () => {
        expect(gameboard.getMissedAttacks()).toEqual([]);
    });

    test('should return an array of all missed attack coordinates', () => {
        // Arrange: Set up a board with misses and a hit
        const ship = createShip(2);
        gameboard.placeShip(ship, 0, 0, 'horizontal');
        gameboard.receiveAttack(0, 0); // This is a HIT
        gameboard.receiveAttack(5, 5); // This is a MISS
        gameboard.receiveAttack(1, 2); // This is another MISS

        // Act: Call the function we are testing
        const missedAttacks = gameboard.getMissedAttacks();

        // Assert: Check if the result is what we expect
        expect(missedAttacks.length).toBe(2); // It should only find 2 misses
        // Use .toEqual to compare arrays and their values
        expect(missedAttacks).toEqual(expect.arrayContaining([
            [5, 5],
            [1, 2]
        ]));
    });
});