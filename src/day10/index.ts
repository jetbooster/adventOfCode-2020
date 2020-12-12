import { readFileSync } from 'fs';
import { join } from 'path';

const sortedNumbers = readFileSync(join(__dirname, './input.txt'), 'utf-8')
  .split('\n').map((num) => Number(num)).sort((a, b) => a - b);
const ARGS = process.argv;

const DEBUG = ['-d', '--debug'].some((flag) => ARGS.includes(flag));

const debug = (logOut: any) => {
  if (DEBUG) {
    console.log(logOut);
  }
};

interface Memo {
  number: number,
  children: number
}

const countGaps = (numbers:number[]):number[] => {
  const gaps: number[] = [];
  gaps.push(numbers[0]); // The gap between first item and 0
  numbers.forEach((val, index) => {
    if (index < numbers.length - 1) {
      gaps.push(numbers[index + 1] - val);
    }
  });
  gaps.push(3); // The gap between the last adapter and the device is always 3
  return gaps;
};

/**
 * Return an array of all possible children of this node
 * Possible children are any values between 1 and 3 jolts greater than current
 */
const nextChildren = (numbers:number[], currValue:number): number[] => numbers
  .filter((num) => num > currValue && num < currValue + 4);

/**
 * Working backwards from the end of the chain, every node will always lead to the same number of options once you jump to it.
 * Record this value as the number of potential options for this node as a memo.
 * If you reach a node for which the onward chain has already been calculated, simply return the known number of unward connections.
 * Otherwise, the number of options will be the addition of the number of options on it's children nodes.
 */
const memoisedChildren = (numbers:number[], memos:Memo[], currValue:number): number => {
  debug({ currValue, memos });
  let memo: Memo|undefined;
  if (memo = memos.find((mem) => mem.number === currValue)) {
    return memo.children;
  }
  if (currValue === numbers[numbers.length - 1]) {
    memos.push({ number: currValue, children: 1 });
    return 1; // You are on the last charger. the only remaining option is to plug it to your device
  }
  const newNumChildren = nextChildren(numbers, currValue)
    .map((child) => memoisedChildren(numbers, memos, child))
    .reduce((prev, curr) => prev + curr);
  memos.push({ number: currValue, children: newNumChildren });
  return newNumChildren;
};

const gaps = countGaps(sortedNumbers);
const oneGaps = gaps.filter((num) => num === 1).length;
const threeGaps = gaps.filter((num) => num === 3).length;

const part1Result = oneGaps * threeGaps;

console.log({ part1Result });

const result = memoisedChildren(sortedNumbers, [], 0);

console.log(result);
