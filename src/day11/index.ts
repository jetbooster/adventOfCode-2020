import { readFileSync } from 'fs';
import { join } from 'path';
import v8 from 'v8';

const grid = readFileSync(join(__dirname, './input.txt'), 'utf-8')
  .split('\n').map((string) => [...string]);

const ARGS = process.argv;

const DEBUG = ['-d', '--debug'].some((flag) => ARGS.includes(flag));

const debug = (logOut: any, prettyPrintGrid = false) => {
  if (DEBUG) {
    if (prettyPrintGrid) {
      const logString = (logOut as any[][]).reduce<string>((prev, curr) => {
        const line = curr.reduce((pre, cur) => pre + cur);
        return `${prev}\n${line}`;
      }, '\n\n');
      console.log(logString);
      return;
    }
    console.log(logOut);
  }
};
const neighbourOffsets = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];

const calcNeighbours = (g: string[][], i:number, j:number) => neighbourOffsets.filter((offset) => {
  const gridX = g.length;
  const gridY = g[0].length;
  let multiplier = 1;
  let hasNeighbour = false;
  let complete = false;
  while (!complete) {
    const ii = i + offset[0] * multiplier;
    const jj = j + offset[1] * multiplier;
    // If neighbour is out of bounds return false
    if (ii > gridX - 1 || ii < 0 || jj > gridY - 1 || jj < 0) {
      hasNeighbour = false;
      complete = true;
      break;
    }
    const val = g[ii][jj];
    switch (val) {
      case '#': {
        hasNeighbour = true;
        complete = true;
        break;
      }
      case '.': {
        multiplier += 1;
        break;
      }
      case 'L': {
        hasNeighbour = false;
        complete = true;
        break;
      }
      default: {
        throw Error('Unrecognised item');
      }
    }
  }
  return hasNeighbour;
}).length;

interface newCellResp {
  val: string,
  changed: boolean
}

const newCellValue = (g: string[][], i:number, j:number): newCellResp => {
  const val = g[i][j];
  if (val === '.') {
    return { val: '.', changed: false };
  }
  const numNeighbours = calcNeighbours(g, i, j);
  if (val === 'L' && numNeighbours === 0) {
    return { val: '#', changed: true };
  }
  if (val === '#' && numNeighbours > 4) {
    return { val: 'L', changed: true };
  }
  return { val, changed: false };
};

interface tickResp {
  grid: string[][],
  changed: boolean
}

const tick = (g:string[][]): tickResp => {
  let changed = false;
  const newGrid = g.map((row, i) => row.map((val, j) => {
    const resp = newCellValue(g, i, j);
    if (resp.changed) {
      changed = true;
    }
    return resp.val;
  }));
  return { grid: newGrid, changed };
};

const main = (g: string[][]) => {
  let changed = true;
  let iterations = 0;
  // Deep Copy grid
  let newGrid: string[][] = v8.deserialize(v8.serialize(g));
  while (changed) {
    const result = tick(newGrid);
    iterations += 1;
    debug(result.grid, true);
    newGrid = result.grid;
    changed = result.changed;
  }
  console.log(`Grid Stable after ${iterations} iterations`);
  return newGrid;
};

const finalGrid = main(grid);

const finalOccupied = finalGrid
  .reduce<number>((prev, curr) => prev + curr.reduce<number>((pre, cur) => (cur === '#' ? pre + 1 : pre), 0), 0);

console.log(finalOccupied);
