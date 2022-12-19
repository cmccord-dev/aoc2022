import _ from "lodash";
import { parseNumsLines } from "../util";

type Arr = (Arr | number)[];
// type PacketContent = number | Packet;
type Packet = Arr;
const comp = (a: number | Packet, b: number | Packet): number => {
//   console.log(a, b);
  if (typeof a === "number") {
    if (typeof b === "number") {
      return a - b;
    } else {
      return comp([a], b);
    }
  } else {
    if (typeof b === "number") {
      return comp(a, [b]);
    } else {
      for (let i = 0; i < Math.min(a.length, b.length); i++) {
        let v = comp(a[i], b[i]);
        if (v != 0) return v;
      }
      return a.length - b.length;
    }
  }
};
export const run = (input: string) => {
  let pairs: Packet[][] = input
    .trim()
    .split("\n\n")
    .map((a) => a.split("\n").map((a) => JSON.parse(a)));
  let sum = 0;
  pairs.forEach((p, i) => (comp(p[0], p[1]) <= 0 ? (sum += i + 1) : 0));
  let dividers = [[[2]], [[6]]];
  let all = pairs.flat(1);
  all.push(...dividers);
  all.sort(comp);
  let key = (1+all.findIndex(a=>comp(a,dividers[0])==0))*(1+all.findIndex(a=>comp(a,dividers[1])==0))
  return [sum, key];
};
