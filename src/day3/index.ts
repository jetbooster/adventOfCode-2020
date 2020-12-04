import { readFileSync } from 'fs';
import { join } from 'path';

const lines = readFileSync(join(__dirname, './input.txt'), 'utf-8').split('\n');

interface IsTree {
  (array: string[], sideSteps: number, downSteps:number, iteration:number, width: number):boolean;
}

const isTree: IsTree = (
  array,
  sideSteps,
  downSteps,
  iteration,
  width,
) => array[iteration * downSteps][(sideSteps * iteration) % width] === '#';

const countTrees = (array: string[], sideSteps:number, downSteps:number) => {
  const { length } = array;
  const width = array[0].length;
  const numIterations = Math.ceil(length / downSteps); // round up for possible non-integer number of side steps
  return [...Array(numIterations)].reduce(
    (
      prevTrees, _, index,
    ) => ((isTree(array, sideSteps, downSteps, index, width)) ? prevTrees + 1 : prevTrees), 0,
  );
};

const results = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
].map(([sideSteps, downSteps]) => countTrees(lines, sideSteps, downSteps));

console.log(results);
console.log(results.reduce((prev, curr) => prev * curr));
