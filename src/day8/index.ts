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

const instructions = ['nop', 'acc', 'jmp'];

interface Instruction {
  instruction: 'nop'|'acc'|'jmp'
  argument: number
}

const instructionTypeguard = (val:string): val is Instruction['instruction'] => instructions.includes(val);

const parseInstruction = (string:string): Instruction => {
  const [instruction, strArgument] = string.split(' ');
  if (instructionTypeguard(instruction)) {
    const inst: Instruction = {
      instruction,
      argument: Number(strArgument),
    };
    return inst;
  }
  debug(`Failed to parse ${string}`);
  throw Error('Failed to parse line');
};

const performInstruction = (index:number, accumulator:number, instruction:Instruction) => {
  switch (instruction.instruction) {
    case 'nop': {
      debug(instruction);
      return { index: index + 1, accumulator };
    }
    case 'jmp': {
      debug(instruction);
      return { index: index + instruction.argument, accumulator };
    }
    case 'acc': {
      debug(instruction);
      return { index: index + 1, accumulator: accumulator + instruction.argument };
    }
    default: {
      throw Error('Unrecognised Instruction');
    }
  }
};

// Satisfies part 1
const runProgram = (input: string[]) => {
  let index = 0;
  let accumulator = 0;
  const visitedIndexes = new Set();
  while (true) {
    // Have we looped or out of bounds?
    console.log(index);
    if (visitedIndexes.has(index) || index >= input.length || index < 0) {
      return accumulator;
    }
    const instruction = parseInstruction(input[index]);
    visitedIndexes.add(index);
    ({ index, accumulator } = performInstruction(index, accumulator, instruction));
  }
};

const result = runProgram(lines);

console.log(result);
