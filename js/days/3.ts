import _ from "lodash";
import { parseNumsLines } from "../util";
import util from "../util";

const value = (v: string) => {
  if (v.charCodeAt(0) <= "Z".charCodeAt(0))
    return 27 + v.charCodeAt(0) - "A".charCodeAt(0);
  return 1 + v.charCodeAt(0) - "a".charCodeAt(0);
};
export const part1 = (input: string) => {
  let sacks = input
    .trim()
    .split("\n")
    .map((sack) => {
      let halves = [
        sack.slice(0, sack.length >> 1),
        sack.slice(sack.length >> 1),
      ];
      let res = [...halves[0]].filter((a) => halves[1].includes(a));
      return res[0];
    });

  return sacks.map(value).reduce((p, c) => p + c);
};
const part2 = (input: string) => {
  let sacks = _.chunk(input.trim().split("\n"), 3).map((halves) => {
    let res = [...halves[0]]
      .filter((a) => halves[1].includes(a))
      .filter((a) => halves[2].includes(a));
    return res[0];
  });

  return sacks.map(value).reduce((p, c) => p + c);
};
export const run = (input: string) => {
  return [part1(input), part2(input)];
};
