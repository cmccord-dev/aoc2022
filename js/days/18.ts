import _ from "lodash";
import { parseNumsLines } from "../util";

export const run = (input: string) => {
  let cubes = input
    .trim()
    .split("\n")
    .map((a) => a.split(",").map((b) => parseInt(b)));
  let map = cubes.reduce((p, c) => {
    if (p[c[0]] === undefined) p[c[0]] = {};
    if (p[c[0]][c[1]] === undefined) p[c[0]][c[1]] = {};
    p[c[0]][c[1]][c[2]] = 1;
    return p;
  }, {} as Record<number, Record<number, Record<number, number>>>);
  //   let surface_area = cubes.reduce((p, c) => {
  //     let free = 0;
  //     for (let i = 0; i < 3; i++) {
  //       c[i]++;
  //       if (map[c[0]]?.[c[1]]?.[c[2]] !== 1) free++;
  //       c[i] -= 2;
  //       if (map[c[0]]?.[c[1]]?.[c[2]] !== 1) free++;
  //       c[i]++;
  //     }
  //     return p + free;
  //   }, 0);
  let min = cubes.reduce(
    (p, c) => c.map((v, i) => Math.min(v - 1, p[i])),
    [999, 999, 999]
  );
  let max = cubes.reduce(
    (p, c) => c.map((v, i) => Math.max(v + 1, p[i])),
    [0, 0, 0]
  );
  let getMap = (c: number[]) => map[c[0]]?.[c[1]]?.[c[2]] ?? 0;
  let setMap = (c: number[], v: number) => {
    if (map[c[0]] === undefined) map[c[0]] = {};
    if (map[c[0]][c[1]] === undefined) map[c[0]][c[1]] = {};
    map[c[0]][c[1]][c[2]] = v;
  };
  let countValue = (v: number) => {
    return cubes.reduce((p, c) => {
      let free = 0;
      for (let i = 0; i < 3; i++) {
        c[i]++;
        if (getMap(c) === v) free++;
        c[i] -= 2;
        if (getMap(c) === v) free++;
        c[i]++;
      }
      return p + free;
    }, 0);
  };
  let recurse = (c: number[]) => {
    if (getMap(c) !== 0) return;
    for (let i = 0; i < 3; i++) if (c[i] < min[i] || c[i] > max[i]) return;
    setMap(c, 2);
    recurse([c[0] - 1, c[1], c[2]]);
    recurse([c[0] + 1, c[1], c[2]]);
    recurse([c[0], c[1] - 1, c[2]]);
    recurse([c[0], c[1] + 1, c[2]]);
    recurse([c[0], c[1], c[2] - 1]);
    recurse([c[0], c[1], c[2] + 1]);
  };
  let surface_area = countValue(0);
  recurse(min);
  return [surface_area, countValue(2)];
};
