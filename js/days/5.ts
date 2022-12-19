import _ from "lodash";
import { parseNumsLines } from "../util";
import util from "../util";

export const run = (input: string) => {
  let rows = input.trimEnd().split("\n");
  let initial: string[][] = [];
  let cols = (rows[0].length + 1) >> 2;
  for (let i = 0; i < cols; i++) initial.push([]);
  while (!rows[0].startsWith(" 1 ")) {
    let row = _.chunk(rows.shift()?.split(""), 4);
    for (let i = 0; i < cols; i++) {
      if (row[i][1] != " ") {
        initial[i].push(row[i][1]);
      }
    }
  }
  rows.splice(0, 2);
  let moves = rows.map((a) => {
    let row = a.split(" ");
    return {
      count: parseInt(row[1]),
      from: parseInt(row[3]),
      to: parseInt(row[5]),
    };
  });

  let initial2 = initial.map(a=>a.join('').split(''));
  moves.forEach((move) => {
    let dat = initial[move.from - 1].splice(0, move.count);
    dat.reverse()
    initial[move.to - 1].unshift(...dat);
  });
  moves.forEach((move) => {
    let dat = initial2[move.from - 1].splice(0, move.count);
    initial2[move.to - 1].unshift(...dat);
  });

  let p1 = initial.reduce((p, c) => {
    return p + c.shift();
  }, "");
  let p2 = initial2.reduce((p, c) => {
    return p + c.shift();
  }, "");

  return [p1, p2];
};
