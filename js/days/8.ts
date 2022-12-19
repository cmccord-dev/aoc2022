import _ from "lodash";
import { parseNumsLines } from "../util";

// export const run = (input: string) => {
//   let grid = input.split("\n").map((a) => a.split("").map((a) => parseInt(a)));
//   let w = grid[0].length;
//   let h = grid.length;
//   let visible = 0;
//   for (let i = 0; i < w; i++) {
//     for (let j = 0; j < h; j++) {
//       let v = grid[j][i];
//       let tmp = true;
//       for (let x = 0; x < i; x++) {
//         if (grid[j][x] >= v) {
//           tmp = false;
//           break;
//         }
//       }
//       if (tmp) {
//         visible++;
//         continue;
//       }
//       tmp = true;
//       for (let x = i + 1; x < w; x++) {
//         if (grid[j][x] >= v) {
//           tmp = false;
//           break;
//         }
//       }
//       if (tmp) {
//         visible++;
//         continue;
//       }
//       tmp = true;
//       for (let y = 0; y < j; y++) {
//         if (grid[y][i] >= v) {
//           tmp = false;
//           break;
//         }
//       }
//       if (tmp) {
//         visible++;
//         continue;
//       }
//       tmp = true;
//       for (let y = j + 1; y < h; y++) {
//         if (grid[y][i] >= v) {
//           tmp = false;
//           break;
//         }
//       }
//       if (tmp) {
//         visible++;
//         continue;
//       }
//     }
//   }
//   return [visible];
// };

export const run = (input: string) => {
  let grid = input
    .trim()
    .split("\n")
    .map((a) => a.split("").map((a) => parseInt(a)));
  let w = grid[0].length;
  let h = grid.length;
  let visible = 0;
  if (0)
    for (let xx = 0; xx < w; xx++) {
      for (let yy = 0; yy < h; yy++) {
        let v = grid[yy][xx];
        let tmp = true;
        for (let x = 0; x < xx; x++) {
          if (grid[yy][x] >= v) {
            tmp = false;
            break;
          }
        }
        if (tmp) {
          visible++;
          continue;
        }
        tmp = true;
        for (let x = xx + 1; x < w; x++) {
          if (grid[yy][x] >= v) {
            tmp = false;
            break;
          }
        }
        if (tmp) {
          visible++;
          continue;
        }
        tmp = true;
        for (let y = 0; y < yy; y++) {
          if (grid[y][xx] >= v) {
            tmp = false;
            break;
          }
        }
        if (tmp) {
          visible++;
          continue;
        }
        tmp = true;
        for (let y = yy + 1; y < h; y++) {
          if (grid[y][xx] >= v) {
            tmp = false;
            break;
          }
        }
        if (tmp) {
          visible++;
          continue;
        }
      }
    }

  let best = 0;
  for (let xx = 0; xx < w; xx++) {
    for (let yy = 0; yy < h; yy++) {
      let v = grid[yy][xx];
      let count = 0;
      let score = 1;
      for (let x = xx - 1; x >= 0; x--) {
        count++;
        if (grid[yy][x] >= v) break;
      }
    //   console.log(xx, yy, v, count);
      score *= count;
      count = 0;
      for (let x = xx + 1; x < w; x++) {
        count++;
        if (grid[yy][x] >= v) break;
      }
      score *= count;
      count = 0;
      for (let y = yy - 1; y >= 0; y--) {
        count++;
        if (grid[y][xx] >= v) break;
      }
      score *= count;
      count = 0;
      for (let y = yy + 1; y < h; y++) {
        count++;
        if (grid[y][xx] >= v) break;
      }
      score *= count;
      best = Math.max(score, best);
    }
  }
  return [visible, best];
};
