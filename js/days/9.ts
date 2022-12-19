import _ from "lodash";
import { parseNumsLines } from "../util";

// export const run = (input: string) => {
//   let head = [0, 0];
//   let tail = [0, 0];
//   let maxDist = 1;
//   let map: any = {};
//   map[tail.join(",")] = true;
//   let dist = () =>
//     Math.max(Math.abs(head[0] - tail[0]), Math.abs(head[1] - tail[1]));
//   let step = (dir: string) => {
//     // console.log(head, tail);
//     switch (dir) {
//       case "L":
//         head[0]--;
//         break;
//       case "R":
//         head[0]++;
//         break;
//       case "U":
//         head[1]++;
//         break;
//       case "D":
//         head[1]--;
//         break;
//     }
//     let d = dist();
//     if (d > maxDist) {
//       if (head[0] == tail[0]) {
//         tail[1] -= Math.sign(tail[1] - head[1]);
//       } else if (head[1] == tail[1]) {
//         tail[0] -= Math.sign(tail[0] - head[0]);
//       } else {
//         tail[0] -= Math.sign(tail[0] - head[0]);
//         tail[1] -= Math.sign(tail[1] - head[1]);
//       }
//     }
//     map[tail.join(",")] = true;
//   };
//   input.split("\n").forEach((row) => {
//     let parts = row.split(" ");
//     let dir = parts[0];
//     let count = parseInt(parts[1]);
//     while (count--) step(dir);
//   });
//   return [Object.keys(map).length];
// };

export const simulate = (input: string, numSeg: number) => {
  let segments: number[][] = [];
  for (let i = 0; i < numSeg; i++) {
    segments.push([0, 0]);
  }
  let map: any = {};
  map[segments[segments.length - 1].join(",")] = true;
  let dist = (head: number[], tail: number[]) =>
    Math.max(Math.abs(head[0] - tail[0]), Math.abs(head[1] - tail[1]));
  let step = (dir: string) => {
    // console.log(head, tail);
    // console.log(segments);
    switch (dir) {
      case "L":
        segments[0][0]--;
        break;
      case "R":
        segments[0][0]++;
        break;
      case "U":
        segments[0][1]++;
        break;
      case "D":
        segments[0][1]--;
        break;
    }
    for (let i = 1; i < segments.length; i++) {
      let d = dist(segments[i - 1], segments[i]);
      if (d > 1) {
        if (segments[i - 1][0] == segments[i][0]) {
          segments[i][1] -= Math.sign(segments[i][1] - segments[i - 1][1]);
        } else if (segments[i - 1][1] == segments[i][1]) {
          segments[i][0] -= Math.sign(segments[i][0] - segments[i - 1][0]);
        } else {
          segments[i][0] -= Math.sign(segments[i][0] - segments[i - 1][0]);
          segments[i][1] -= Math.sign(segments[i][1] - segments[i - 1][1]);
        }
      }
    }
    map[segments[segments.length - 1].join(",")] = true;
  };
  input.split("\n").forEach((row) => {
    let parts = row.split(" ");
    let dir = parts[0];
    let count = parseInt(parts[1]);
    while (count--) step(dir);
  });
  return Object.keys(map).length;
};

export const run = (input: string) => {
  let segments: number[][] = [];
  for (let i = 0; i < 10; i++) {
    segments.push([0, 0]);
  }
  let maxDist = 1;
  let map1: any = {};
  let map2: any = {};
  map1[segments[1].join(",")] = true;
  map2[segments[segments.length - 1].join(",")] = true;
  let dist = (head: number[], tail: number[]) =>
    Math.max(Math.abs(head[0] - tail[0]), Math.abs(head[1] - tail[1]));
  let step = (dir: string) => {
    // console.log(head, tail);
    // console.log(segments);
    switch (dir) {
      case "L":
        segments[0][0]--;
        break;
      case "R":
        segments[0][0]++;
        break;
      case "U":
        segments[0][1]++;
        break;
      case "D":
        segments[0][1]--;
        break;
    }
    for (let i = 1; i < segments.length; i++) {
      let d = dist(segments[i - 1], segments[i]);
      if (d > maxDist) {
        if (segments[i - 1][0] == segments[i][0]) {
          segments[i][1] -= Math.sign(segments[i][1] - segments[i - 1][1]);
        } else if (segments[i - 1][1] == segments[i][1]) {
          segments[i][0] -= Math.sign(segments[i][0] - segments[i - 1][0]);
        } else {
          segments[i][0] -= Math.sign(segments[i][0] - segments[i - 1][0]);
          segments[i][1] -= Math.sign(segments[i][1] - segments[i - 1][1]);
        }
      }
    }
    map1[segments[1].join(",")] = true;
    map2[segments[segments.length - 1].join(",")] = true;
  };
  input.split("\n").forEach((row) => {
    let parts = row.split(" ");
    let dir = parts[0];
    let count = parseInt(parts[1]);
    while (count--) step(dir);
  });
  return [Object.keys(map1).length,Object.keys(map2).length];
};
