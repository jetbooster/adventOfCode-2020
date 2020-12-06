import { readFileSync } from 'fs';
import { join } from 'path';

const lines = readFileSync(join(__dirname, './input.txt'), 'utf-8').split('\n');

const buildGroups = (rows:string[]) => {
  const groups: string[][] = [];
  rows.push('');
  rows.reduce((accum, curr) => {
    if (curr === '') {
      groups.push(accum);
      return [];
    }
    accum.push(curr);
    return accum;
  }, <string[]>[]);
  return groups;
};

const uniqueLetters = (group: string[]) => {
  // Sets make this pretty easy, as they enforce uniqueness of keys!
  const set = new Set<string>();
  group.forEach((member) => {
    [...member].forEach((character) => {
      set.add(character);
    });
  });
  return Array.from(set).join('');
};

const commonLetters = (group: string[]) => group.reduce<string[]>(
  (prev, curr) => [...prev].filter(
    (char) => curr.includes(char),
  ), [...group[0]],
).join('');

const sumOfCounts = (groups: string[]) => groups.reduce<number>((acc, curr) => acc + curr.length, 0);

const groups = buildGroups(lines);
const uniqueAnswers = groups.map(uniqueLetters);
const commonAnswers = groups.map(commonLetters);

console.log({
  uniqueAnswers,
  commonAnswers,
  uniqCount: sumOfCounts(uniqueAnswers),
  commonCount: sumOfCounts(commonAnswers),
});
