import { readFileSync } from 'fs';
import { join } from 'path';

const lines = readFileSync(join(__dirname, './input.txt'), 'utf-8').split('\n');
const ARGS = process.argv;

const DEBUG = ['-d', '--debug'].some((flag) => ARGS.includes(flag));

const debug = (logOut: any) => {
  if (DEBUG) {
    console.log(logOut);
  }
};

interface Child {
  number: number,
  name: string
}

interface Bag {
  name: string,
  children: Child[],
  canHoldShinyGold?: boolean,
  numChildren?: number
}

const parseChildren = (children:string) => {
  if (children === 'no other bags') {
    return [];
  }
  let result;
  const parsedChildren: Child[] = [];
  // Any number of words (with spaces, including numbers), followed by a . or ,
  const regex = /((\w+\s)+\w+)[.,]/g;
  while ((result = regex.exec(children)) !== null) {
    const [, group] = result;
    // A number, then any number of words seperated by spaces, with final trailing s for pluralisation removed
    const parsedChild = /(\d+) ((\w+\s)+\w+[^s])/.exec(group);
    if (parsedChild) {
      const number = Number(parsedChild[1]);
      const name = parsedChild[2];
      parsedChildren.push({ number, name });
    }
  }
  return parsedChildren;
};

const parseLine = (line:string): Bag => {
  // Convert bags -> bag on input
  const [name, children] = line.split('s contain ');
  const childs = parseChildren(children);
  return { name, children: childs };
};

const recursiveCanHoldBag = (parsedLines: Bag[], name:string): boolean => {
  const bag = parsedLines.find((item) => name === item.name);
  if (!bag) {
    throw Error('No bag with that name found');
  }
  debug(bag);
  if (bag.canHoldShinyGold !== undefined) {
    debug('canHoldShinyGold Already defined');
    return bag.canHoldShinyGold;
  }
  if (bag.children.find((child) => child.name === 'shiny gold bag')) {
    debug('Can hold shiny gold directly');
    bag.canHoldShinyGold = true;
    return true;
  }
  if (bag.children.length === 0) {
    debug('bag can hold no children');
    bag.canHoldShinyGold = false;
    return false;
  }
  const result = bag.children.map((child) => recursiveCanHoldBag(parsedLines, child.name));
  debug(result);
  const reducedResult = result.some((val) => val);
  bag.canHoldShinyGold = reducedResult;
  return reducedResult;
};

const recursiveCountBags = (parsedLines: Bag[], name:string): number => {
  const bag = parsedLines.find((item) => name === item.name);
  if (!bag) {
    throw Error('No bag with that name found');
  }
  debug(bag);
  if (bag.numChildren !== undefined) {
    debug('numChildren Already defined');
    return bag.numChildren;
  }
  if (bag.children.length === 0) {
    debug('bag can hold no children');
    bag.numChildren = 0;
    return 0;
  }
  // Each bag contains N bags, where N is the number of child bags, PLUS the number child bag's children times the number of child bags.
  // If a bag contains 2 children, which themselves have no children, the result needs to be 2.
  // This count does not include the Bag itself, just how many bags it contains.
  const result = bag.children.map((child) => child.number + child.number * recursiveCountBags(parsedLines, child.name));
  const reducedResult = result.reduce((prev, curr) => prev + curr);
  bag.numChildren = reducedResult;
  debug(bag);
  return reducedResult;
};

const parsedLines = lines.map(parseLine);
parsedLines.forEach((bag) => recursiveCanHoldBag(parsedLines, bag.name));
const bagsContainingGold = parsedLines.reduce<number>((prev, curr) => prev + Number(curr.canHoldShinyGold), 0);
const bagsInGold = recursiveCountBags(parsedLines, 'shiny gold bag');
console.log({ bagsContainingGold, bagsInGold });

// console.log(parsedLines);
