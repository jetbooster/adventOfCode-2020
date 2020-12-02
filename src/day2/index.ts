import { readFileSync } from 'fs';
import { join } from 'path';

const lines = readFileSync(join(__dirname, './input.txt'), 'utf-8').split('\n');

interface Parsed {
    min: number,
    max: number,
    char: string,
    pass: string,
    charsInPass: number
    meetsPasswordPolicy2: boolean
}

const meetsCriteria1 = (p:Parsed): boolean => (p.min <= p.charsInPass && p.max >= p.charsInPass);
const meetsCriteria2 = (pos1: number, pos2: number, char:string, pass:string): boolean => (
  // Logical XOR
  (pass[pos1] === char)
    ? !(pass[pos2] === char)
    : (pass[pos2] === char)
);

const parse = (line:string): Parsed => {
  // extract all elements using regex groups
  const result = /(\d+)-(\d+) (\w): (.*)/g.exec(line);
  if (result) {
    const [, min, max, char, pass] = result;
    // easiest way to count occurances
    const charsInPass = (pass.match(new RegExp(`${char}`, 'g')) || []).length;
    // -1 to convert to 0-index
    const meetsPasswordPolicy2 = meetsCriteria2(Number(min) - 1, Number(max) - 1, char, pass);
    return {
      min: Number(min), max: Number(max), char, pass, charsInPass, meetsPasswordPolicy2,
    };
  }
  throw Error('Regex failed');
};

const parsedArray = lines.map(parse);
const meetsPasswordPolicy1 = parsedArray.filter(meetsCriteria1).length;
const meetsPasswordPolicy2 = parsedArray.filter((p) => p.meetsPasswordPolicy2).length;
console.log({ meetsPasswordPolicy1, meetsPasswordPolicy2 });
