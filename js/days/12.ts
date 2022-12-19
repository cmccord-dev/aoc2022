import _ from "lodash";
import { parseNumsLines } from "../util";

export const run = (input: string) => {
  let a = "a".charCodeAt(0);
  let map = input
    .trim()
    .split("\n")
    .map((a) => a.split(""));
  let q: number[][] = [];
  let goal = [0, 0];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == "S") {
        q.push([i, j, 0, 0, -1]);
      }
      if (map[i][j] == "E") {
        goal = [i, j];
      }
    }
  }
  console.log(goal);
  let steps = 0;
  let height = (v: string) => (v == "E" ? 26 : v.charCodeAt(0) - a);
  let heuristic = (x: number, y: number) =>
    Math.abs(goal[0] - y) + Math.abs(goal[1] - x);
  q[0][3] = heuristic(q[0][0], q[0][1]);
  while (q.length) {
    q.sort((a, b) => a[2] + a[3] - b[2] + b[3]);
    // console.log(q);
    let [y, x, dist, heur, h] = q.shift()!;

    if (y == goal[0] && x == goal[1]) break;
    steps = dist;
    if (map[y][x] == ".") continue;
    map[y][x] = ".";
    // steps++;
    // if (map[y][x] == "E") break;
    if (y > 0 && height(map[y - 1][x]) <= h + 1)
      q.push([y - 1, x, dist + 1, heuristic(y - 1, x), height(map[y - 1][x])]);

    if (y < map.length - 1 && height(map[y + 1][x]) <= h + 1)
      q.push([y + 1, x, dist + 1, heuristic(y + 1, x), height(map[y + 1][x])]);

    if (x > 0 && height(map[y][x - 1]) <= h + 1)
      q.push([y, x - 1, dist + 1, heuristic(y, x - 1), height(map[y][x - 1])]);

    if (x < map[0].length - 1 && height(map[y][x + 1]) <= h + 1)
      q.push([y, x + 1, dist + 1, heuristic(y, x + 1), height(map[y][x + 1])]);
  }
  //   console.log(map.map((a) => a.join("")).join("\n"));
  return [steps, part2(input)];
};

const part2 = (input: string) => {
  let a = "a".charCodeAt(0);
  let map = input
    .trim()
    .split("\n")
    .map((a) => a.split(""));
  let q: number[][] = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == "S") {
        map[i][j] = "a";
      }
      if (map[i][j] == "E") {
        q.push([i, j, 0, 26]);
      }
    }
  }
  let steps = 0;
  let height = (v: string) => (v == "E" ? 26 : v.charCodeAt(0) - a);
  while (q.length) {
    q.sort((a, b) => a[2] + a[3] - b[2] + b[3]);
    // console.log(q);
    let [y, x, dist, h] = q.shift()!;

    if (map[y][x] == "a") {
      steps = dist;
      break;
    }
    if (map[y][x] == ".") continue;
    map[y][x] = ".";
    // steps++;
    // if (map[y][x] == "E") break;
    if (y > 0 && height(map[y - 1][x]) >= h - 1)
      q.push([y - 1, x, dist + 1, height(map[y - 1][x])]);

    if (y < map.length - 1 && height(map[y + 1][x]) >= h - 1)
      q.push([y + 1, x, dist + 1, height(map[y + 1][x])]);

    if (x > 0 && height(map[y][x - 1]) >= h - 1)
      q.push([y, x - 1, dist + 1, height(map[y][x - 1])]);

    if (x < map[0].length - 1 && height(map[y][x + 1]) >= h - 1)
      q.push([y, x + 1, dist + 1, height(map[y][x + 1])]);
  }
  console.log(map.map((a) => a.join("")).join("\n"));
  return steps;
};
