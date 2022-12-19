import _ from "lodash";
import { parseNumsLines } from "../util";

export const run = (input: string) => {
  return [part1(input), part2(input)];
};

const part1 = (input: string) => {
  let paths: number[][][] = input
    .trim()
    .split("\n")
    .map((line) =>
      line.split("->").map((a) =>
        a
          .trim()
          .split(",")
          .map((a) => parseInt(a))
      )
    );
  let minX = 1000;
  let maxX = 0;
  let maxY = 0;
  paths.forEach((p) =>
    p.forEach((e) => {
      minX = Math.min(e[0], minX);
      maxX = Math.max(e[0], maxX);
      maxY = Math.max(e[1], maxY);
    })
  );
  minX--;
  let map: string[][] = [];
  for (let j = 0; j < maxY + 2; j++) {
    let row: string[] = [];
    for (let i = minX; i < maxX + 1; i++) {
      row.push(".");
    }
    map.push(row);
  }
  //   console.log(map.map((a) => a.join("")).join("\n"));
  paths.forEach((path) => {
    path.reduce((p, c) => {
      if (p[0] == c[0]) {
        for (let i = Math.min(p[1], c[1]); i <= Math.max(p[1], c[1]); i++)
          map[i][p[0] - minX] = "#";
      } else {
        for (let i = Math.min(p[0], c[0]); i <= Math.max(p[0], c[0]); i++)
          map[p[1]][i - minX] = "#";
      }
      return c;
    });
  });

  let count = 0;
  while (true) {
    let x = 500 - minX;
    let y = 0;
    while (true) {
      if (y + 1 > maxY) {
        return count;
      }
      if (map[y + 1][x] == ".") {
        y++;
      } else if (map[y + 1][x - 1] == ".") {
        y++;
        x--;
      } else if (map[y + 1][x + 1] == ".") {
        y++;
        x++;
      } else {
        map[y][x] = "o";
        break;
      }
    }
    // console.log(map.map((a) => a.join("")).join("\n"));
    count++;
  }
};

const part2 = (input: string) => {
  let paths: number[][][] = input
    .trim()
    .split("\n")
    .map((line) =>
      line.split("->").map((a) =>
        a
          .trim()
          .split(",")
          .map((a) => parseInt(a))
      )
    );
  let minX = 0;
  let maxX = 999;
  let maxY = 0;
  paths.forEach((p) =>
    p.forEach((e) => {
      //   minX = Math.min(e[0], minX);
      //   maxX = Math.max(e[0], maxX);
      maxY = Math.max(e[1], maxY);
    })
  );
  minX--;
  let map: string[][] = [];
  for (let j = 0; j <= maxY + 1; j++) {
    let row: string[] = [];
    for (let i = minX; i < maxX + 1; i++) {
      row.push(".");
    }
    map.push(row);
  }
  //   console.log(map.map((a) => a.join("")).join("\n"));
  paths.forEach((path) => {
    path.reduce((p, c) => {
      if (p[0] == c[0]) {
        for (let i = Math.min(p[1], c[1]); i <= Math.max(p[1], c[1]); i++)
          map[i][p[0] - minX] = "#";
      } else {
        for (let i = Math.min(p[0], c[0]); i <= Math.max(p[0], c[0]); i++)
          map[p[1]][i - minX] = "#";
      }
      return c;
    });
  });

  let count = 0;
  while (true) {
    let x = 500 - minX;
    let y = 0;
    count++;
    while (true) {
      if (map[y + 1] === undefined) {
        map[y][x] = "o";
        break;
        // return count;
      } else if (map[y + 1][x] == ".") {
        y++;
      } else if (map[y + 1][x - 1] == ".") {
        y++;
        x--;
      } else if (map[y + 1][x + 1] == ".") {
        y++;
        x++;
      } else {
        map[y][x] = "o";
        if (y == 0 && x == 500 - minX) return count;
        break;
      }
    }
    // console.log(map.map((a) => a.join("")).join("\n"));
  }
};
