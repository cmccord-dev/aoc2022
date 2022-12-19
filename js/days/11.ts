import _ from "lodash";
import { parseNumsLines } from "../util";

export const run = (input: string) => {
  let monkeys = input
    .trim()
    .split("\n\n")
    .map((a) => {
      let lines = a.split("\n");
      let items = lines[1]
        .split(": ")[1]
        .split(",")
        .map((a) => BigInt(a.trim()));
      let operation = lines[2].split(" old ")[1].trim();
      // console.log(operation);

      let useV = operation.slice(2) == "old";
      let val: bigint;
      if (useV) val = 0n;
      else val = BigInt(operation.slice(2));
      let op: (v: bigint) => bigint = (v) => v;
      switch (operation[0]) {
        default:
        case "*":
          op = (v) => v * (useV ? v : val);
          break;
        case "+":
          op = (v) => v + (useV ? v : val);
          break;
        case "-":
          op = (v) => v - (useV ? v : val);
          break;
        case "/":
          op = (v) => v / (useV ? v : val);
          break;
      }
      let test = BigInt(lines[3].split(" by ")[1]);
      let dstTrue = parseInt(lines[4].split(" ").pop()!);
      let dstFalse = parseInt(lines[5].split(" ").pop()!);
      return {
        items,
        op,
        test,
        dstFalse,
        dstTrue,
        inspections: 0,
      };
    });
  let mod = monkeys.reduce((p, c) => p * c.test, 1n);
  console.log(mod);
  //   console.log(monkeys);
  for (let round = 0; round < 10000; round++) {
    // if (round % 100 == 0) console.log(round);
    for (let monkey of monkeys) {
      while (monkey.items.length) {
        monkey.inspections++;
        let item = monkey.items.shift()!;
        item = (monkey.op(item) / 1n);
        monkeys[
          item % monkey.test ? monkey.dstFalse : monkey.dstTrue
        ].items.push(item % mod);
      }
    }
    if ((round + 1) % 1000 == 0 || round == 19 || round == 0) {
      console.log(`=== After round ${round + 1} ===`);
      for (let m in monkeys) {
        console.log(`Monkey ${m}: ${monkeys[m].inspections}`);
      }
      console.log("\n");
    }
  }
  //   console.log(monkeys);
  monkeys.sort((a, b) => a.inspections - b.inspections);
  return [
    BigInt(monkeys.pop()!.inspections) * BigInt(monkeys.pop()!.inspections),
  ];
};
