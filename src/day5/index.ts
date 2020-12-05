import { readFileSync } from 'fs';
import { join } from 'path';

const lines = readFileSync(join(__dirname, './input.txt'), 'utf-8').split('\n');

interface Seat {
  row: number
  column: number
  seatId: number
}

const binaryConvert = (string:string) => {
  const one = ['B', 'R'];
  const zero = ['F', 'L'];
  const onesReplaced = one.reduce((prev, curr) => prev.replace(new RegExp(curr, 'g'), '1'), string);
  const zerosReplaced = zero.reduce((prev, curr) => prev.replace(new RegExp(curr, 'g'), '0'), onesReplaced);
  return zerosReplaced;
};

const seatDecode = (binaryString:string): Seat => {
  const row = parseInt(binaryString.slice(0, 7), 2);
  const column = parseInt(binaryString.slice(7), 2);
  const seatId = row * 8 + column;
  return { row, column, seatId };
};

const idToSeat = (id:number): Seat => {
  const column = id % 8;
  const row = (id - column) / 8;
  return { row, column, seatId: id };
};

const findMissing = (seats:Seat[], min:number, max:number) => {
  // Create an array containing the numbers from min to max inclusive
  const allIds = [...Array(max - min + 1).keys()].map((val) => val + min);

  // This has HORRIBLE time complexity
  seats.forEach((seat) => {
    const index = allIds.findIndex((id) => id === seat.seatId);
    if (index === -1) {
      return;
    }
    // splice is mutative, took a while to track down that bug
    allIds.splice(index, 1);
  });
  // If the predicate, that only one seat is unfilled is true, only one element should remain in the array
  if (allIds.length === 1) {
    return idToSeat(allIds[0]);
  }
  throw Error('Multiple possible seats!');
};

const parsed = lines.map(binaryConvert).map(seatDecode);
const highestSeatId = parsed.reduce((prev, curr) => ((prev.seatId > curr.seatId) ? prev : curr));
const lowestSeatId = parsed.reduce((prev, curr) => ((prev.seatId < curr.seatId) ? prev : curr));
const mySeat = findMissing(parsed, lowestSeatId.seatId, highestSeatId.seatId);

console.log({ highestSeatId, lowestSeatId, mySeat });
