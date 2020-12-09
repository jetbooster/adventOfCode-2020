import { readFileSync } from 'fs';
import { join } from 'path';

const numbers = readFileSync(join(__dirname, './input.txt'), 'utf-8').split('\n').map((num) => Number(num));
const ARGS = process.argv;

const DEBUG = ['-d', '--debug'].some((flag) => ARGS.includes(flag));

const debug = (logOut: any) => {
  if (DEBUG) {
    console.log(logOut);
  }
};

const matchesPattern = (array: number[], num: number, index: number, preamble: number) => {
  const prevNums = array.slice(index - preamble, index);
  let valid2:number|undefined;
  const valid1 = prevNums.find((num1, index1) => {
    valid2 = prevNums.find((num2, index2) => {
      if (index1 === index2) { // Can't match with itself
        return false;
      }
      return num === num1 + num2;
    });
    return valid2 || undefined;
  });
  if (valid1 && valid2) {
    debug(`${valid1}+${valid2}=${num}`);
    return true;
  }
  return false;
};
const findOutlierIndex = (array:number[], preamble: number) => array.findIndex((num, index) => {
  if (index < preamble) {
    return false;
  }
  return !matchesPattern(array, num, index, preamble);
});

const findContiguousSet = (array: number[], target:number, targetIndex:number) => {
  let setSize = 2;
  // From Eyeballing, no elements AFTER index 640 are less than 1309761972, and we would need two, so we only need to consider the set below
  let index = 0;
  let currentSet: number[];
  let successfulSet:number[];
  const trimmedArray = array.slice(0, targetIndex);
  while (true) {
    if (index + setSize > trimmedArray.length) {
      // The set overhangs the array, so cannot exist.
      // reset and try a larger set
      debug(`No sets of size ${setSize} satisfy`);
      index = 0;
      setSize += 1;
    }
    currentSet = trimmedArray.slice(index, index + setSize);
    if (currentSet.reduce((prev, curr) => prev + curr) === target) {
      successfulSet = currentSet;
      break;
    }
    index += 1;
  }
  return successfulSet;
};

const outlierIndex = findOutlierIndex(numbers, 25);

const sumSet = findContiguousSet(numbers, numbers[outlierIndex], outlierIndex);

const sortedSet = sumSet.sort((a, b) => a - b);
const part2Answer = sortedSet[0] + sortedSet[sortedSet.length - 1];

console.log({ part1Answer: numbers[outlierIndex], part2Answer });
