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

type Facing = 'N'|'S'|'E'|'W'

const FACING_ARRAY: Facing[] = ['E', 'S', 'W', 'N'];
const FACING_MULTIPLIERS = [[1, 0], [0, -1], [-1, 0], [0, 1]];

interface Instruction {
  type: 'move'|'turn',
  amount: number
}

interface Turn extends Instruction {
  type: 'turn'
  direction: 'R'|'L'
}

interface Move extends Instruction {
  type: 'move',
  direction: 'N'|'S'|'E'|'W'|'F'
}

type UnknownInstruction = Turn|Move

interface Ship {
  facing: Facing,
  northDist: number,
  eastDist: number
}

const parseInstruction = (string:string): UnknownInstruction => {
  const [action, ...rest] = string;
  const amount = Number(rest.join(''));
  switch (action) {
    case 'F':
    case 'N':
    case 'S':
    case 'E':
    case 'W': {
      return {
        type: 'move',
        amount,
        direction: action,
      };
    }
    case 'R':
    case 'L': {
      return {
        type: 'turn',
        amount,
        direction: action,
      };
    }
    default: {
      throw Error('Unrecognised Instruction');
    }
  }
};

const performTurn = (ship:Ship, instruction:Turn): Ship => {
  let rot = (instruction.amount / 90) % 4; // How many clicks around the FACING_ARRAY to go
  rot = (instruction.direction === 'L') ? (-rot + 4) : rot; // Left turns go counterclockwise. Add 4 so that modulo still returns expected answer
  const currFacing = FACING_ARRAY.findIndex((facing) => ship.facing === facing);
  const newFacing = FACING_ARRAY[(currFacing + rot) % 4];
  return {
    ...ship,
    facing: newFacing,
  };
};

const performMove = (ship: Ship, instruction: Move): Ship => {
  switch (instruction.direction) {
    case 'N': {
      return {
        ...ship,
        northDist: ship.northDist + instruction.amount,
      };
    }
    case 'S': {
      return {
        ...ship,
        northDist: ship.northDist - instruction.amount,
      };
    }
    case 'E': {
      return {
        ...ship,
        eastDist: ship.eastDist + instruction.amount,
      };
    }
    case 'W': {
      return {
        ...ship,
        eastDist: ship.eastDist - instruction.amount,
      };
    }
    case 'F': {
      const index = FACING_ARRAY.findIndex((facing) => ship.facing === facing);
      const multiplier = FACING_MULTIPLIERS[index];
      const newShip = {
        ...ship,
        eastDist: ship.eastDist + multiplier[0] * instruction.amount,
        northDist: ship.northDist + multiplier[1] * instruction.amount,
      };
      return newShip;
    }
    default: {
      throw Error('Seriously, ESLint, there shouldn\'t be any way to get here');
    }
  }
};

const performInstruction = (ship:Ship, instruction:UnknownInstruction): Ship => {
  switch (instruction.type) {
    case 'move': {
      return performMove(ship, instruction);
    }
    case 'turn': {
      return performTurn(ship, instruction);
    }
    default: {
      throw Error('How did you even get here');
    }
  }
};

const instructions = lines.map(parseInstruction);

const ship: Ship = {
  facing: 'E',
  northDist: 0,
  eastDist: 0,
};

const result = instructions.reduce<Ship>((prev, curr) => {
  const res = performInstruction(prev, curr);
  debug({
    beforeInstruction: prev,
    instruction: curr,
    afterInstuction: res,
  });
  return res;
}, ship);
console.log({ result, manhattan: Math.abs(result.eastDist) + Math.abs(result.northDist) });
