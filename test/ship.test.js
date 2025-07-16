import {createShip} from '../src/ship'

describe('Ship Factory' , ()=>{
    test('create a ship object with correct length',()=>{
        const myship = createShip(4);
        expect(myship.length).toBe(4)
    });
    test("isSunk() return false for new ship" ,()=>{
        const myship = createShip(3);
        expect(myship.isSunk()).toBe(false);
    });
    test('hit() increases the number of hit ',()=>{
        const myship = createShip(5);
        myship.hit();
        expect(myship.isSunk()).toBe(false);
    });
    test("isSunk() results true if hit equals length of ship" ,()=>{
        const myship = createShip(3);
        myship.hit();
        myship.hit();
        myship.hit();
        expect(myship.isSunk()).toBe(true);

    })
});