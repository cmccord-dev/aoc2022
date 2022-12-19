import _ from "lodash";
import { parseNumsLines } from "../util";

export const run = (input: string) => {
  return [part1(input), part2(input)];
};

const manhattan = (a: number[], b: number[]): number =>
  Math.abs(a[1] - b[1]) + Math.abs(a[0] - b[0]);
const part1 = (input: string) => {
  let data = input
    .trim()
    .split("\n")
    .map((line) => {
      return line.split(":").map((a) =>
        a
          .split(" at ")[1]
          .split(", ")
          .map((b) => parseInt(b.split("=")[1]))
      );
    });
  //   let target = 10;
  //   target = 2000000;
  let ranges: number[][] = [];
  for (let datum of data) {
    let sensor = datum[0];
    let beacon = datum[1];
    let dist = manhattan(beacon, sensor);
    //   Math.abs(beacon[1] - sensor[1]) + Math.abs(beacon[0] - sensor[0]);
    if (Math.abs(sensor[1] - target) <= dist) {
      let val = Math.abs(sensor[1] - target);
      let startx = sensor[0] - (dist - val);
      let endx = sensor[0] + (dist - val);
      ranges.push([startx, endx]);
    }
  }
  ranges.sort((a, b) => {
    if (a[0] - b[0] != 0) return a[0] - b[0];
    return a[1] - b[1];
  });
  //   console.log(ranges);
  let newRanges: number[][] = [];
  let currentRange = ranges.shift()!;
  while (ranges.length) {
    let next = ranges.shift()!;
    // console.log(next, currentRange);
    if (next[0] <= currentRange[1]) {
      if (currentRange[1] < next[1]) currentRange[1] = next[1];
    } else {
      newRanges.push(currentRange);
      currentRange = next;
    }
  }
  newRanges.push(currentRange);
  //   console.log(newRanges);
  let count = newRanges.reduce((p, c) => p + c[1] - c[0] + 1, 0);
  return count - 1;
};

const intersect = (a: number[][], b: number[][]): number[][][] => {
  let ax1 = a[0][0];
  let ay1 = a[0][1];
  let bx1 = b[0][0];
  let by1 = b[0][1];
  let ax2 = a[1][0];
  let ay2 = a[1][1];
  let bx2 = b[1][0];
  let by2 = b[1][1];
  if (bx2 < ax1) return [a];
  if (bx1 > ax2) return [a];
  if (by2 < ay1) return [a];
  if (by1 > ay2) return [a];
  if (ax1 >= bx1 && ax2 <= bx2 && ay1 >= by1 && ay2 <= by2) return [];
  //we've guaranteed overlap now
  let xs = [ax1, bx1, bx2, ax2];
  let ys = [ay1, by1, by2, ay2];
  xs.sort((a, b) => a - b);
  ys.sort((a, b) => a - b);
  xs = [xs[0], xs[1] - 1, xs[1], xs[2], xs[2] + 1, xs[3]];
  ys = [ys[0], ys[1] - 1, ys[1], ys[2], ys[2] + 1, ys[3]];
  //   let ys = [ax1, bx1 - 1, bx1, bx2, bx2 + 1, ax2];
  //   let ys = [ay1, by1 - 1, by1, by2, by2 + 1, ay2];
  //   console.log(xs, ys);
  let ranges: number[][][] = [];
  for (let i = 0; i < 6; i += 2) {
    for (let j = 0; j < 6; j += 2) {
      //   if (j == 2 && i == 2) continue;
      //   if (xs[i] == xs[i + 1] || ys[j] == ys[j + 1]) continue;
      ranges.push([
        [xs[i], ys[j]],
        [xs[i + 1], ys[j + 1]],
      ]);
    }
  }
  //   console.log(ranges);
  return ranges
    .filter((a) => {
      return (
        a[0][0] <= ax2 && a[1][0] >= ax1 && a[0][1] <= ay2 && a[1][1] >= ay1
      );
    })
    .filter((a) => {
      return !(
        a[0][0] <= bx2 &&
        a[1][0] >= bx1 &&
        a[0][1] <= by2 &&
        a[1][1] >= by1
      );
    });
  //   return ranges;

  //   if (ax1 < bx1 && ax2 > bx2 && ay1 < by1 && ay2 > by2) {
  //     return [
  //         [
  //           [ax1, ay1],
  //           [bx1, by1],
  //         ],
  //       [
  //         [ax1, ay1],
  //         [bx1, by1],
  //       ],
  //       [
  //         [bx2, ay1],
  //         [ax2, ay2],
  //       ],
  //       [
  //         [bx1, ay1],
  //         [bx2, by1],
  //       ],
  //       [
  //         [bx1, by2],
  //         [bx2, ay2],
  //       ],
  //     ];
  //   }
  //   if (ax1 < bx1 && bx2 <= ax2) {
  //   }
  //   //   if (ax1 < bx1 && ax2 > bx2) {
  //   //   }

  //   if (ax1 >= bx1) {
  //     //left overlap
  //   } else {
  //   }

  //   if (ax1 <= bx1 && ax2 >= bx2 && ay1 <= by1 && ay2 >= by2) {

  //   }
  //   if (bx2 >= ax1 && bx2 <= ax2) {
  //   }
  return [];
};
const part2 = (input: string) => {
  let data = input
    .trim()
    .split("\n")
    .map((line) => {
      return line.split(":").map((a) =>
        a
          .split(" at ")[1]
          .split(", ")
          .map((b) => parseInt(b.split("=")[1]))
      );
    })
    .map((datum) => {
      let sensor = datum[0];
      let beacon = datum[1];
      let dist = manhattan(beacon, sensor);
      return {
        center: sensor,
        dist,
      };
    });
  for (let i = 0; i <= 2 * target; i++) {
    let ranges: number[][] = [];
    for (let datum of data) {
      //   Math.abs(beacon[1] - sensor[1]) + Math.abs(beacon[0] - sensor[0]);
      if (Math.abs(datum.center[1] - i) <= datum.dist) {
        let val = datum.dist - Math.abs(datum.center[1] - i);
        let startx = datum.center[0] - val;
        let endx = datum.center[0] + val;
        ranges.push([startx, endx]);
      }
    }
    ranges.sort((a, b) => {
      if (a[0] - b[0] != 0) return a[0] - b[0];
      return a[1] - b[1];
    });
    //   console.log(ranges);
    let newRanges: number[][] = [];
    let currentRange = ranges.shift()!;
    while (ranges.length) {
      let next = ranges.shift()!;
      // console.log(next, currentRange);
      if (next[0] <= currentRange[1]) {
        if (currentRange[1] < next[1]) currentRange[1] = next[1];
      } else {
        newRanges.push(currentRange);
        currentRange = next;
      }
    }
    // if (i == 11) console.log(newRanges);
    // console.log(newRanges);
    if (newRanges.length && currentRange[0] <= target * 2) {
      console.log(i, currentRange[0] - 1);
      return BigInt(i) + 4000000n * BigInt(currentRange[0] - 1);
    }
  }
  //     .map((a) => {
  //       return {
  //         center: [a.center[0] + a.center[1], a.center[1] - a.center[0]],
  //         dist: a.dist >> 1,
  //       };
  //     });
  //   data.sort((a, b) => b.dist - a.dist);
  //   let blocks: number[][][] = [
  //     [
  //       [-target * 2, -target * 2],
  //       [target * 2, target * 2],
  //     ],
  //   ];
  //   let max = data.reduce((p, c) => {
  //     return Math.max(p, c.center[1] + c.dist);
  //   }, 0);
  //   console.log(max);
  //   for (let i = 0; i < data.length; i++) {
  //     let block = data[i];
  //     let upper_left = block.center.map((a) => a - block.dist);
  //     let bottom_right = block.center.map((a) => a + block.dist);
  //     let newBlocks: typeof blocks = [];
  //     blocks.forEach((b) => {
  //       newBlocks.push(...intersect(b, [upper_left, bottom_right]));
  //     });
  //     blocks = newBlocks;
  //     console.log([upper_left, bottom_right], blocks);
  //   }
  //   console.log(blocks.map((a) => a.map((b) => [b[1] - b[0], b[1] + b[0]])));

  //   console.log(
  //     intersect(
  //       [
  //         [0, 0],
  //         [5, 5],
  //       ],
  //       [
  //         [1, 1],
  //         [10, 10],
  //       ]
  //     )
  //   );

  //   console.log(data);
};

let target = 10;
  target = 2000000;
