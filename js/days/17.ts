import _ from "lodash";
import { parseNumsLines } from "../util";

const printMap = (map: number[]) => {
  let lines = [`+-------+`];
  for (let i = 0; i < map.length; i++) {
    let s = "|";
    for (let j = 0; j < 7; j++) {
      s += map[i] & (1 << (6 - j)) ? "#" : ".";
    }
    lines.push(s + "|");
  }
  lines.push("\n");
  lines.reverse();
  console.log(lines.join("\n"));
};
export const run = (input: string) => {
    console.log(input.trim().length)
  return [part1(input), part2(input)];
};
export const part2 = (input: string) => {
  let wind = input.trim().split("");
  let tops: number[] = [];
  let memo: any = {};

  let current: number[] = [];
  let addRow = () => {
    current.push(0);
  };
  let tetronimos: number[][] = [
    [0b1111],
    [0b010, 0b111, 0b010],
    [0b001, 0b001, 0b111],
    // [0b111, 0b001, 0b001],
    [1, 1, 1, 1],
    [3, 3],
  ];
  let tetWidth = [4, 3, 3, 1, 2];
  let tetHeight = [1, 3, 3, 4, 2];
  let teti = 0;
  let wi = 0;
  let top = 0;
  let count = 0;
  while (true) {
    tops.push(top);

    let tet = tetronimos[teti];
    let height = tetHeight[teti];
    // while (current.length < top + 3 + height) addRow();
    let t = top + 2 + tetHeight[teti];
    let r = 5 - tetWidth[teti];
    // console.log(r);
    let collides = (t: number, r: number) => {
      if (t - height + 1 < 0) return true;
      for (let i = 0; i < height; i++) {
        if (t - i >= current.length) continue;
        if ((current[t - i] & (tet[i] << r)) != 0) return true;
      }
      return false;
    };
    while (true) {
      //   console.log(t, r, wind[wi]);
      let w = wind[wi++];
      wi %= wind.length;
      if (w == ">") {
        if (r > 0 && !collides(t, r - 1)) r--;
      } else {
        if (r + tetWidth[teti] < 7 && !collides(t, r + 1)) r++;
      }
      if (collides(t - 1, r)) break;
      t--;
    }
    // console.log(collides(t, r));
    // console.log(t, r, tet, current);
    teti = (teti + 1) % tetronimos.length;
    top = Math.max(top, t + 1);
    while (t >= current.length) addRow();
    for (let i = 0; i < height; i++) {
      current[t - i] |= tet[i] << r;
    }
    count++;

    let v = 0;
    for (let i = current.length - 1; i >= 0; i--) {
      v |= current[i];
      if (v == 0b1111111) {
        let k: any[] = [wi, teti];
        for (let j = i; j < current.length; j++) {
          k.push(current[j]);
        }
        if (memo[k.join(",")]) {
            console.log("found", k.join(","));
          let lastCount = memo[k.join(",")];
          let lastTop = tops[lastCount];
          let diff = count - lastCount;
          let topDiff = top - lastTop;
          let c = BigInt(diff); //BigInt(memo[k.join(",")]);
          let dst = 1000000000000n - BigInt(lastCount);
          let mul = dst / c;
          let rem = dst % c;
          let base = BigInt(lastTop);
          //   console.log(count, lastCount, diff);
          //   console.log(
          //     mul,
          //     rem,
          //     c,
          //     base,
          //     1514285714288n / c,
          //     1514285714288n / mul
          //   );
          let v =
            base +
            BigInt(topDiff) * mul +
            BigInt(tops[Number(rem) + lastCount] - lastTop); //- BigInt(tops[lastCount]);
          console.log(v - 1514285714288n);
          return v;
        } else {
          memo[k.join(",")] = count;
        }
        break;
        // if (memo) console.log(t, wi, teti);
      }
    }

    // printMap(current);
    // if (count > 6) break;
  }
  return top;
};
export const part1 = (input: string) => {
  let wind = input.trim().split("");
  let current: number[] = [];
  let addRow = () => {
    current.push(0);
  };
  let tetronimos: number[][] = [
    [0b1111],
    [0b010, 0b111, 0b010],
    [0b001, 0b001, 0b111],
    // [0b111, 0b001, 0b001],
    [1, 1, 1, 1],
    [3, 3],
  ];
  let tetWidth = [4, 3, 3, 1, 2];
  let tetHeight = [1, 3, 3, 4, 2];
  let teti = 0;
  let wi = 0;
  let top = 0;
  let count = 0;
  while (count < 2022) {
    let tet = tetronimos[teti];
    let height = tetHeight[teti];
    // while (current.length < top + 3 + height) addRow();
    let t = top + 2 + tetHeight[teti];
    let r = 5 - tetWidth[teti];
    // console.log(r);
    let collides = (t: number, r: number) => {
      if (t - height + 1 < 0) return true;
      for (let i = 0; i < height; i++) {
        if (t - i >= current.length) continue;
        if ((current[t - i] & (tet[i] << r)) != 0) return true;
      }
      return false;
    };
    while (true) {
      //   console.log(t, r, wind[wi]);
      let w = wind[wi++];
      wi %= wind.length;
      if (w == ">") {
        if (r > 0 && !collides(t, r - 1)) r--;
      } else {
        if (r + tetWidth[teti] < 7 && !collides(t, r + 1)) r++;
      }
      if (collides(t - 1, r)) break;
      t--;
    }
    // console.log(collides(t, r));
    // console.log(t, r, tet, current);
    while (t >= current.length) addRow();
    for (let i = 0; i < height; i++) {
      current[t - i] |= tet[i] << r;
    }
    top = Math.max(top, t + 1);
    // printMap(current);
    teti = (teti + 1) % tetronimos.length;
    count++;
    // if (count > 6) break;
  }
  return top;
};
