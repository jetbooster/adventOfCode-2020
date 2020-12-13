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

interface Waypoint {
  eastDist: number,
  northDist: number
}

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

interface Ship extends Waypoint{
  facing: Facing,
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

const performMove = (ship: Ship, wp: Waypoint, instruction: Move): {wp:Waypoint, ship:Ship} => {
  switch (instruction.direction) {
    case 'N': {
      return {
        wp: {
          ...wp,
          northDist: wp.northDist + instruction.amount,
        },
        ship,
      };
    }
    case 'S': {
      return {
        wp: {
          ...wp,
          northDist: wp.northDist - instruction.amount,
        },
        ship,
      };
    }
    case 'E': {
      return {
        wp: {
          ...wp,
          eastDist: wp.eastDist + instruction.amount,
        },
        ship,
      };
    }
    case 'W': {
      return {
        wp: {
          ...wp,
          eastDist: wp.eastDist - instruction.amount,
        },
        ship,
      };
    }
    case 'F': {
      // Capture ship to Waypoint Distance
      const shipToWaypointE = wp.eastDist - ship.eastDist;
      const shipToWaypointN = wp.northDist - ship.northDist;
      // Move ship that distance, instruction.amount times
      const newShip: Ship = {
        ...ship,
        northDist: ship.northDist + instruction.amount * shipToWaypointN,
        eastDist: ship.eastDist + instruction.amount * shipToWaypointE,
      };
      // Update waypoint to maintain ship to waypoint distance
      const newWp: Waypoint = {
        eastDist: newShip.eastDist + shipToWaypointE,
        northDist: newShip.northDist + shipToWaypointN,
      };
      return {
        wp: newWp,
        ship: newShip,
      };
    }
    default: {
      throw Error('Seriously, ESLint, there shouldn\'t be any way to get here');
    }
  }
};

// I had to look up how to do this
const rotateAroundPoint = (target: Waypoint, origin:Waypoint, r90s: number): Waypoint => {
  // Subtract origin from target to create psuedo origin
  const pseudoOrigin: Waypoint = {
    northDist: target.northDist - origin.northDist,
    eastDist: target.eastDist - origin.eastDist,
  };
  let pseudoPoint: Waypoint;
  // I'm so glad it's only 90 degree increments
  switch (r90s) {
    case 1: {
      pseudoPoint = {
        eastDist: pseudoOrigin.northDist,
        northDist: -pseudoOrigin.eastDist,
      };
      break;
    }
    case 2: {
      pseudoPoint = {
        eastDist: -pseudoOrigin.eastDist,
        northDist: -pseudoOrigin.northDist,
      };
      break;
    }
    case 3: {
      pseudoPoint = {
        eastDist: -pseudoOrigin.northDist,
        northDist: pseudoOrigin.eastDist,
      };
      break;
    }
    case 4: {
      pseudoPoint = {
        eastDist: pseudoOrigin.eastDist,
        northDist: pseudoOrigin.northDist,
      };
      break;
    }
    default: {
      throw Error('These Red lines ugh');
    }
  }
  // Add Origin back to new point
  pseudoPoint = {
    eastDist: pseudoPoint.eastDist + origin.eastDist,
    northDist: pseudoPoint.northDist + origin.northDist,
  };
  return pseudoPoint;
};

const performTurn = (ship:Ship, wp: Waypoint, instruction:Turn): {wp:Waypoint, ship:Ship} => {
  let r90s = (instruction.amount / 90) % 4; // How many 90 degree CW clicks around the FACING_ARRAY to go
  r90s = (instruction.direction === 'L') ? (-r90s + 4) : r90s; // Left turns go counterclockwise. Add 4 so that modulo still returns expected answer
  const newWp = rotateAroundPoint(wp, ship, r90s);
  return {
    wp: newWp,
    ship,
  };
};

const performInstruction = (ship:Ship, waypoint:Waypoint, instruction:UnknownInstruction): {wp:Waypoint, ship:Ship} => {
  switch (instruction.type) {
    case 'move': {
      return performMove(ship, waypoint, instruction);
    }
    case 'turn': {
      return performTurn(ship, waypoint, instruction);
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

const waypoint: Waypoint = {
  eastDist: 10,
  northDist: 1,
};

const result = instructions.reduce<{wp:Waypoint, ship:Ship}>((prev, curr) => {
  const res = performInstruction(prev.ship, prev.wp, curr);
  debug({
    beforeInstruction: prev,
    instruction: curr,
    afterInstuction: res,
  });
  return res;
}, { wp: waypoint, ship });
console.log({ result, manhattan: Math.abs(result.ship.eastDist) + Math.abs(result.ship.northDist) });
