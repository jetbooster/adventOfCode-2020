import { readFileSync } from 'fs';
import { join } from 'path';

const rows = readFileSync(join(__dirname, './input.txt'), 'utf-8').split('\n');

const validateDate = (item:string, len:number, min:number, max:number) => item.length === len
  && Number(item)
  && Number(item) >= min
  && Number(item) <= max;

const requiredFields = [
  {
    name: 'byr',
    validate: (item:string) => validateDate(item, 4, 1920, 2002),
  },
  {
    name: 'iyr',
    validate: (item:string) => validateDate(item, 4, 1920, 2002),
  },
  {
    name: 'eyr',
    validate: (item:string) => validateDate(item, 4, 1920, 2002),
  },
  {
    name: 'hgt',
    validate: (item:string) => {
      const unit = item.slice(item.length - 2);
      const val = Number(item.slice(0, item.length - 2));
      return (unit === 'cm') ? (val <= 193 && val >= 150) : (val <= 76 && val >= 59);
    },
  },
  {
    name: 'hcl',
    validate: (item:string) => /^#[0-9a-f]{6}$/.test(item),
  },
  {
    name: 'ecl',
    validate: (item:string) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(item),
  },
  {
    name: 'pid',
    validate: (item:string) => /^[0-9]{9}$/.test(item),
  },
];

interface Passport {
  [key:string]:string
}

const linesToPassports = (lines: string[]): string[] => {
  const passports: string[] = [];
  let passport: string;
  lines.forEach((line:string) => {
    if (line === '') {
      passports.push(passport);
      passport = '';
      return;
    }
    if (!passport) {
      passport = line;
      return;
    }
    passport = passport.concat(` ${line}`);
  });
  return passports;
};

const parse = (passport: string): Passport => {
  const p:Passport = {};
  const result = passport.split(' ')
    .map((attribs) => attribs.split(':'));
  result.forEach(([attrib, value]) => {
    p[attrib] = value;
  });
  return p;
};

// if .some returns true, a required field is missing
const isInvalid = (passport:Passport) => {
  let failReason = '';
  requiredFields.some((field) => {
    const res = passport[field.name];
    if (!res) failReason = `No ${field.name}`;
    return !res;
  });
  if (!failReason) {
    // Passport has all required fields
    requiredFields.some((field) => {
      const res = field.validate(passport[field.name]);
      if (!res) failReason = `${field.name} failed validation`;
      return !res;
    });
  }
  return failReason;
};

const result = linesToPassports(rows)
  .map(parse)
  .filter((p) => { const res = isInvalid(p); console.log({ res, p }); return !res; }).length;
console.log(result);
