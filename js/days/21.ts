import _, { find } from "lodash";
import { parseNumsLines } from "../util";

export const run = (input: string) => {
  type Monkey =
    | {
        type: "leaf";
        id: string;
        value: number;
        hasHumn: boolean;
      }
    | {
        type: "node";
        left: string;
        right: string;
        op: string;
        hasHumn: boolean;
        id: string;
      };
  let monkeys: Record<string, Monkey> = {};
  let referenced: Set<string> = new Set();
  input
    .trim()
    .split("\n")
    .forEach((m) => {
      let [id, right] = m.split(": ")!;
      let parts = right.trim().split(" ");
      if (parts.length == 1)
        monkeys[id] = {
          type: "leaf",
          value: parseInt(right),
          hasHumn: false,
          id,
        };
      else {
        referenced.add(parts[0]);
        referenced.add(parts[2]);
        monkeys[id] = {
          type: "node",
          left: parts[0],
          op: parts[1],
          right: parts[2],
          hasHumn: false,
          id,
        };
      }
    });
  let recurse = (m: Monkey): number => {
    switch (m.type) {
      case "leaf":
        return m.value;
      case "node": {
        let a = recurse(monkeys[m.left]);
        let b = recurse(monkeys[m.right]);
        return eval(`${a} ${m.op} ${b}`) as number;
      }
    }
    throw "";
  };
  let v = 0;
  //   Object.keys(monkeys).forEach((m) => {
  //     if (referenced.has(m)) return;
  //     v = recurse(monkeys[m]);
  //   });
  let part1 = recurse(monkeys["root"]);
  let find_humn = (m: Monkey): boolean => {
    if (m.id == "humn") m.hasHumn = true;
    if (m.type == "node") {
      m.hasHumn = find_humn(monkeys[m.left]) || find_humn(monkeys[m.right]);
    }
    return m.hasHumn;
  };
  let opinv: Record<string, string> = {
    "+": "-",
    "-": "+",
    "*": "/",
    "/": "*",
  };
  let eval_humn = (m: Monkey, curr: number): number => {
    // console.log(m, curr);
    if (m.id == "humn") return curr;
    else {
      switch (m.type) {
        case "leaf":
          throw curr;
        case "node":
          let left = monkeys[m.left];
          let right = monkeys[m.right];
          if (left.hasHumn) {
            switch (m.op) {
              case "+":
                return eval_humn(left, curr - recurse(right));
              case "-":
                return eval_humn(left, curr + recurse(right));
              case "*":
                return eval_humn(left, curr / recurse(right));
              case "/":
                return eval_humn(left, curr * recurse(right));
            }
          } else {
            switch (m.op) {
              case "+":
                return eval_humn(right, curr - recurse(left));
              case "-":
                return eval_humn(right, recurse(left) - curr);
              case "*":
                return eval_humn(right, curr / recurse(left));
              case "/":
                return eval_humn(right, recurse(left) / curr);
            }
          }
          break;
      }
      throw "";
    }
    return 0;
  };
  let part2: number = 0;
  if (monkeys["root"].type == "node") {
    let root = monkeys["root"];
    find_humn(monkeys["root"]);
    if (monkeys[root.left].hasHumn)
      part2 = eval_humn(monkeys[root.left], recurse(monkeys[root.right]));
    else part2 = eval_humn(monkeys[root.right], recurse(monkeys[root.left]));
  }

  return [part1, part2];
};
