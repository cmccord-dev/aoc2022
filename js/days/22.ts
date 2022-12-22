import _ from "lodash";
import { parseNumsLines } from "../util";

export const run = (input: string) => {
  let parts = input.split("\n\n");
  let bin = parts[0].split("\n").map((a) => a.split(""));
  let w = bin.reduce((p, c) => Math.max(p, c.length), 0);
  let h = bin.length;
  let path = parts[1]
    .trim()
    .split(/([LR])/g)
    .map((a) => {
      if (a == "L" || a == "R") return a;
      return parseInt(a);
    });
  interface Tile {
    adj: Tile[];
    newDir: number[];
    isWall: boolean;
    x: number;
    y: number;
    lastVisit: number;
    region: number;
  }
  let board: Record<number, Tile> = {};
  let board2: Record<number, Tile> = {};
  let cubeSize = w < 20 ? 4 : 50;
  let cube =
    w < 20
      ? [
          [8, 0],
          [0, 4],
          [4, 4],
          [8, 4],
          [8, 8],
          [12, 8],
        ]
      : [
          [50, 0],
          [100, 0],
          [50, 50],
          [0, 100],
          [50, 100],
          [0, 150],
        ];
  // let cubeRegions = [-3,_,_,-2,3,]
  let adj = {
    0: [
      [5, 2],
      [3, 1],
      [2, 2],
      [1, 1],
    ],
    1: [
      [2, 0],
      [4, 3],
      [5, 3],
      [0, 1],
    ],
    2: [
      [3, 0],
      [4, 0],
      [1, 3],
      [0, 0],
    ],
    3: [
      [5, 1],
      [4, 1],
      [2, 2],
      [0, 3],
    ],
    4: [
      [5, 0],
      [1, 3],
      [2, 3],
      [3, 3],
    ],
    5: [
      [0, 2],
      [1, 0],
      [4, 2],
      [3, 2],
    ],
  };

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      let k = i * w + j;
      let t = bin[i]?.[j];
      if (t !== undefined && t != " ") {
        let region = cube.findIndex((c) => {
          let a = j - c[0];
          let b = i - c[1];
        //   console.log(c, j, i, a, b);
          if (a < 0 || b < 0) return false;
          return a < cubeSize && b < cubeSize;
        });
        board[k] = {
          adj: [],
          isWall: t == "#",
          newDir: [],
          x: j,
          y: i,
          lastVisit: -1,
          region,
        };
        board2[k] = {
          adj: [],
          isWall: t == "#",
          newDir: [],
          x: j,
          y: i,
          lastVisit: -1,
          region,
        };
      }
    }
  }
  Object.values(board).forEach((tile) => {
    for (let i = 0; i < 4; i++) {
      let x = tile.x;
      let y = tile.y;
      let go = () => {
        switch (i) {
          case 0:
            x = (x + 1) % w;
            break;
          case 1:
            y = (y + 1) % h;
            break;
          case 2:
            x--;
            if (x < 0) x += w;
            break;
          case 3:
            y--;
            if (y < 0) y += h;
            break;
        }
        return y * w + x;
      };
      let k = go();
      while (board[k] === undefined) {
        k = go();
      }
      tile.adj.push(board[k]);
    }
  });

  Object.values(board2).forEach((tile) => {
    for (let i = 0; i < 4; i++) {
      let x = tile.x;
      let y = tile.y;
      //   let dir = i;
      //   console.log(tile);
      let k = y * w + x;
      let reg = tile.region;
      let orig = cube[reg];
      let cx = x - orig[0];
      let cy = y - orig[1];
      let [dsti, dir] = adj[reg as keyof typeof adj][i];
      let dstCube = cube[dsti];
      let outDir = i;
      let transform = () => {
        x = dstCube[0] + cx;
        y = dstCube[1] + cy;
        outDir = dir;
      };
      switch (i) {
        case 0:
          {
            if (cx < cubeSize) x++;
            else {
              switch (dir) {
                case 0:
                  cx = 0;
                  break;
                case 1:
                  cx = cubeSize - 1 - cy;
                  cy = 0;
                  break;
                case 2:
                  cx = cubeSize - 1;
                  break;
                case 3:
                  cx = cy;
                  cy = cubeSize - 1;
                  break;
              }
              transform();
            }
          }
          break;
        case 1:
          if (cy < cubeSize) y++;
          else {
            switch (dir) {
              case 0:
                cy = cx;
                cx = cubeSize - 1;
                break;
              case 1:
                cy = 0;
                break;
              case 2:
                cy = cubeSize - 1 - cx;
                cx = 0;
                break;
              case 3:
                cy = cubeSize - 1;
                break;
            }
            transform();
          }
          break;
        case 2:
          if (cx > 0) x--;
          else {
            switch (dir) {
              case 0:
                cx = cubeSize - 1;
                break;
              case 1:
                cx = cy;
                cy = cubeSize - 1;
                break;
              case 2:
                cx = 0;
                break;
              case 3:
                cx = cubeSize - 1 - cy;
                cy = 0;
                break;
            }
            transform();
          }
          break;
        case 3:
          if (cy > 0) y--;
          else {
            switch (dir) {
              case 0:
                cy = cx;
                cx = cubeSize - 1;
                break;
              case 1:
                cy = 0;
                break;
              case 2:
                cy = cubeSize - 1 - cx;
                cx = 0;
                break;
              case 3:
                cy = cubeSize - 1;
                break;
            }
            transform();
          }
          break;
      }
      k = y * w + x;

      if (board2[k] === undefined) {
        throw "e";
      }
      tile.adj.push(board2[k]);
      tile.newDir.push(outDir);
    }
  });

  let curr = board[bin[0].findIndex((a) => a != " ")];
  let dir = 0;
  path.forEach((p) => {
    if (p === "L") dir = dir ? dir - 1 : 3;
    else if (p === "R") dir = (dir + 1) % 4;
    else {
      while (p--) {
        curr.lastVisit = dir;
        let next = curr.adj[dir];
        if (next.isWall) break;
        curr = next;
      }
      //   console.log(`${curr.x} ${curr.y} ${dir}`);
    }
  });

  curr = board2[bin[0].findIndex((a) => a != " ")];
  dir = 0;
  path.forEach((p) => {
    if (p === "L") dir = dir ? dir - 1 : 3;
    else if (p === "R") dir = (dir + 1) % 4;
    else {
      while (p--) {
        curr.lastVisit = dir;
        console.log(curr);
        let next = curr.adj[dir];
        if (next.isWall) break;
        dir = curr.newDir[dir];
        curr = next;
      }
      //   console.log(`${curr.x} ${curr.y} ${dir}`);
    }
  });
  for (let i = 0; i < h; i++) {
    let row: string[] = [];
    for (let j = 0; j < w; j++) {
      let t = board2[i * w + j];
      if (t) {
        if (t.isWall) {
          if (t.lastVisit != -1) throw "";
          row.push("#");
        } else {
          row.push([".", ">", "v", "<", "^"][t.lastVisit + 1]);
        }
      } else {
        row.push(" ");
      }
    }
    console.log(row.join(""));
  }
  return 1000 * (curr.y + 1) + 4 * (curr.x + 1) + dir;
};
