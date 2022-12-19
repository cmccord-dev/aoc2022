import _ from "lodash";
import { parseNumsLines } from "../util";

interface Range {
  s: number;
  e: number;
}
const parseRange = (range: string): Range => {
  let parts = range.split("-");
  return {
    s: parseInt(parts[0]),
    e: parseInt(parts[1]),
  };
};
const parsePair = (line: string) => {
  return line.split(",").map(parseRange);
};
const pairOverlaps = ([a, b]: Range[]) => {
  if (a.s == b.s || a.e == b.e) return true;
  if (a.s < b.s) return a.e > b.e;
  return b.e > a.e;
};
const pairOverlaps2 = ([a,b]: Range[]) => {
  if (a.s == b.s || a.e == b.e) return true;
  if (a.s < b.s) return a.e >= b.s;
  return b.e >= a.s;
}
export const run = (input: string) => {
  let elves = input.trim().split("\n").map(parsePair);
  return [elves.filter(pairOverlaps).length, elves.filter(pairOverlaps2).length];
};
