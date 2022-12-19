import _ from "lodash";
import { parseNumsLines } from "../util";

export const run = (input: string) => {
  let instrs = input
    .trim()
    .split("\n")
    .map((a) => (a.startsWith("addx") ? parseInt(a.slice(5)) : a));
  let x: number = 1;
  let cycle = 0;
  let check = 20;
  let strength = 0;

  let rows: string[][] = [];
  //   for (let i = 0; i < instrs.length; i++) {
  //     let arr: string[] = [];
  //     for (let a = 0; a < 40; a++) {
  //       arr.push(".");
  //     }
  //     rows.push(arr);
  //   }
  let incr_cycle = () => {
    if (cycle % 40 == 0) {
      let arr: string[] = [];
      for (let a = 0; a < 40; a++) {
        arr.push(".");
      }
      rows.push(arr);
    }
    let row = rows.length - 1;
    // console.log(x, cycle % 40);
    // console.log(Math.abs(x - ((cycle + 1) % 40)))
    if (Math.abs(x - (cycle % 40)) <= 1) {
      rows[row][cycle % 40] = "#";
      //   console.log(rows[row]);
    }
    cycle++;
    // if (x >= 1 && x <= 40) rows[row][x - 1] = "#";
    // if (x >= 0 && x <= 39) rows[row][x] = "#";
    // if (x >= -1 && x <= 38) rows[row][x + 1] = "#";
    if (cycle == check) {
      //   console.log(cycle * x, x, cycle);
      strength += cycle * x;
      check += 40;
    }
  };
  for (let instr of instrs) {
    incr_cycle();
    if (instr != "noop") {
      incr_cycle();
      x += instr as number;
    }
  }
  console.log(rows.map((a) => a.join("")).join("\n"));
  return [strength, rows.map((a) => a.join("")).join("\n")];
};
