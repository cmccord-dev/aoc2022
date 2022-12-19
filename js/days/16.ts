import _, { max } from "lodash";
import { parseNumsLines } from "../util";

export const run = (input: string) => {
  interface Valve {
    name: string;
    id: number;
    flow: number;
    adj: Valve[];
    open: boolean;
  }
  let valves: { [k: string]: Valve } = {};
  //   let valveList: Valve[] = [];

  let valveList: Valve[] = input
    .trim()
    .split("\n")
    .map((a, i) => {
      console.log(a);
      let src = a.split(" ")[1];
      let dst = a.split(/valves? /)[1].split(", ");
      let rate = parseInt(a.slice(23));
      let b = {
        name: src,
        id: i,
        flow: rate,
        adj: dst as unknown as Valve[],
        open: false,
      } as Valve;
      valves[b.name] = b;
      return b;
    })
    .map((a) => {
      let v: Valve = {
        ...a,
        adj: a.adj.map((b) => valves[b as unknown as string]),
      };
      return v;
    });

  let startTime = new Date() as unknown as number;

  let dist: number[][] = [];
  for (let i = 0; i < valveList.length; i++) {
    let row: number[] = [];
    for (let j = 0; j < valveList.length; j++) {
      row.push(999999);
    }
    dist.push(row);
  }
  //   console.log(valveList);
  valveList.forEach((v) => {
    dist[v.id][v.id] = 0;
    v.adj.forEach((a) => {
      dist[v.id][a.id] = 1;
    });
  });
  for (let k = 0; k < valveList.length; k++) {
    for (let i = 0; i < valveList.length; i++) {
      for (let j = 0; j < valveList.length; j++) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  let best = 0;
  let start = valves.AA.id;
  const runMemo = (list: Valve[], time: number, map: any) => {
    let memo = (valves: Valve[], place: number, time: number) => {
      if (time <= 2) return 0;
      let k = [valves.map((t) => t.name).join(""), place, time].join(",");
      if (map[k] === undefined) {
        let v = 0;
        for (let i = 0; i < valves.length; i++) {
          let d = dist[place][valves[i].id];
          let rem = time - 1 - d;
          let vtmp = [...valves.slice(0, i), ...valves.slice(i + 1)];
          let v2 = valves[i].flow * rem;
          v = Math.max(v, v2 + memo(vtmp, valves[i].id, rem));
        }

        map[k] = v;
      }
      return map[k];
    };
    return memo(list, start, time);
  };
  const runMemo2 = (list: Valve[], init: number, time: number, map: any) => {
    let memo = (valves: number, place: number, time: number) => {
      if (time <= 2) return 0;
      let k = (((valves << 6) | place) << 5) | time;
      // let k = [valves, place, time].join(",");
      if (map[k] === undefined) {
        let v = 0;
        let tmp = valves;
        while (tmp) {
          let i = 31 - Math.clz32(tmp & -tmp);
          tmp &= ~(1 << i);
          let vtmp = valves & ~(1 << i);
          if (vtmp) {
            let d = dist[place][list[i].id];
            let rem = time - 1 - d;
            let v2 = list[i].flow * rem;
            let n = v2+memo(vtmp, list[i].id, rem);
            if(n > v) v = n;
            // v = Math.max(v, v2 + memo(vtmp, list[i].id, rem));
          }
        }

        map[k] = v;
      }
      return map[k];
    };
    return memo(init, start, time);
  };
  let map = {};
  let filtered = valveList.filter((a) => a.flow);
  let part1 = runMemo2(filtered, (1 << filtered.length) - 1, 30, map);
  console.log(Object.keys(map).length);
  console.log((new Date() as unknown as number) - startTime);
  console.log(part1);

  let list = valveList.filter((a) => a.flow);

  let checkAll = (a: number, b: number, start: number): number => {
    if (start == list.length) {
      return runMemo2(list, a, 26, map) + runMemo2(list, b, 26, map);
    }
    return Math.max(
      checkAll(a | (1 << start), b, start + 1),
      checkAll(a, b | (1 << start), start + 1)
    );
  };
  let checkAll2 = (a: number, b: number, start: number): number => {
    let len = (1 << list.length) / 2;
    let mask = (1 << list.length) - 1;
    let best = part1;
    for (let i = 0; i < len; i++) {
      best = Math.max(
        best,
        runMemo2(list, i, 26, map) + runMemo2(list, ~i & mask, 26, map)
      );
    }
    return best;
  };
  let part2 = checkAll2(0, 0, 0);
  console.log(Object.keys(map).length);
  return [part1, part2]; //2587
};

//   export const run = (input: string) => {
//     interface Valve {
//       name: string;
//       id: number;
//       flow: number;
//       adj: Valve[];
//       open: boolean;
//     }
//     let valves: { [k: string]: Valve } = {};
//     //   let valveList: Valve[] = [];

//     let valveList: Valve[] = input
//       .trim()
//       .split("\n")
//       .map((a, i) => {
//         console.log(a);
//         let src = a.split(" ")[1];
//         let dst = a.split(/valves? /)[1].split(", ");
//         let rate = parseInt(a.slice(23));
//         let b = {
//           name: src,
//           id: i,
//           flow: rate,
//           adj: dst as unknown as Valve[],
//           open: false,
//         } as Valve;
//         valves[b.name] = b;
//         return b;
//       })
//       .map((a) => {
//         let v: Valve = {
//           ...a,
//           adj: a.adj.map((b) => valves[b as unknown as string]),
//         };
//         return v;
//       });

//     const numOpen = 0;

//     let dist: number[][] = [];
//     for (let i = 0; i < valveList.length; i++) {
//       let row: number[] = [];
//       for (let j = 0; j < valveList.length; j++) {
//         row.push(999999);
//       }
//       dist.push(row);
//     }
//     //   console.log(valveList);
//     valveList.forEach((v) => {
//       dist[v.id][v.id] = 0;
//       v.adj.forEach((a) => {
//         dist[v.id][a.id] = 1;
//       });
//     });
//     for (let k = 0; k < valveList.length; k++) {
//       for (let i = 0; i < valveList.length; i++) {
//         for (let j = 0; j < valveList.length; j++) {
//           if (dist[i][j] > dist[i][k] + dist[k][j]) {
//             dist[i][j] = dist[i][k] + dist[k][j];
//           }
//         }
//       }
//     }

//     let best = 0;
//     let start = valves.AA.id;
//     let map: any = {};
//     let memo = (valves: Valve[], place: number, time: number) => {

//     };
//     let run = (valves: Valve[]) => {
//       let released = 0;
//       let time = 30;
//       let curr = start;
//       let value = (v: Valve) => {
//         return (time - dist[curr][v.id] - 1) * v.flow;
//       };
//       for (let valve of valves) {
//         //   valves.sort((a, b) => value(b) - value(a));
//         //   let valve = valves.shift()!;
//         let d = dist[curr][valve.id];
//         curr = valve.id;
//         if (time <= d) break;
//         time -= d;
//         released += --time * valve.flow;
//       }
//       // if (released > best) {
//       //   best = released;
//       //   console.log(best, valves.map((a) => a.name).join("->"));
//       //   console.log(valves, best);
//       // }
//       return released;
//     };

//     let genPerm = (k: number, a: Valve[]) => {
//       if (k == 1) {
//         run(a);
//       } else {
//         genPerm(k - 1, a);
//         for (let i = 0; i < k - 1; i++) {
//           // if (k == a.length - 1) {
//           //   console.log(i);
//           // }
//           let tmp = a[k - 1];
//           if (k & 1) {
//             a[k - 1] = a[0];
//             a[0] = tmp;
//           } else {
//             a[k - 1] = a[i];
//             a[i] = tmp;
//           }
//           genPerm(k - 1, a);
//         }
//       }
//     };
//     let tmpList = valveList.filter((a) => a.flow);
//     //   tmpList.sort((a, b) => b.flow - a.flow);
//     console.log(valveList.map((a) => a.name));
//     genPerm(tmpList.length, tmpList);
//     //   run(tmpList);
//     return best;
//   };

//   export const run = (input: string) => {
//     interface Valve {
//       name: string;
//       id: number;
//       flow: number;
//       adj: Valve[];
//       open: boolean;
//     }
//     let valves: { [k: string]: Valve } = {};
//     let valveList: Valve[] = [];
//     input
//       .trim()
//       .split("\n")
//       .forEach((a) => {
//         console.log(a);
//         let src = a.split(" ")[1];
//         let dst = a
//           .split(/valves? /)[1]
//           .split(", ")
//           .map((a) => {
//             if (valves[a] === undefined) {
//               valves[a] = {
//                 name: src,
//                 id: valveList.length,
//                 flow: 0,
//                 adj: [],
//                 open: false,
//               };
//               valveList.push(valves[a]);
//             }

//             return valves[a];
//           });
//         let rate = parseInt(a.slice(23));
//         if (valves[src] === undefined) {
//           valves[src] = {
//             name: src,
//             id: valveList.length,
//             flow: rate,
//             adj: dst,
//             open: false,
//           };
//           valveList.push(valves[src]);
//         } else {
//           valves[src].flow = rate;
//           valves[src].adj = dst;
//         }
//       });

//     const numOpen = 0;

//     let dist: number[][] = [];
//     for (let i = 0; i < valveList.length; i++) {
//       let row: number[] = [];
//       for (let j = 0; j < valveList.length; j++) {
//         row.push(999999);
//       }
//       dist.push(row);
//     }
//     //   console.log(valveList);
//     valveList.forEach((v) => {
//       dist[v.id][v.id] = 0;
//       v.adj.forEach((a) => {
//         dist[v.id][a.id] = 1;
//       });
//     });
//     for (let k = 0; k < valveList.length; k++) {
//       for (let i = 0; i < valveList.length; i++) {
//         for (let j = 0; j < valveList.length; j++) {
//           if (dist[i][j] > dist[i][k] + dist[k][j]) {
//             dist[i][j] = dist[i][k] + dist[k][j];
//           }
//         }
//       }
//     }

//     let best = 0;
//     let run = (valves: Valve[]) => {
//       let released = 0;
//       let time = 29;
//       let curr = 0;
//       for (let valve of valves) {
//         let d = dist[curr][valve.id];
//         curr = valve.id;
//         if (time <= d) break;
//         time -= d;
//         released += --time * valve.flow;
//       }
//       if (released > best) {
//         best = released;
//         console.log(best);
//         //   console.log(valves, best);
//       }
//     };
//     let run_old = (valves: Valve[]) => {
//       let releasing = 0;
//       let released = 0;
//       let time = 29;
//       let move = (from: number, to: number) => {
//         let d = dist[from][to];
//         //   console.log(valveList[from], valveList[to], d);
//         if (time < d) d = time;
//         released += d * releasing;
//         time -= d;
//       };
//       let curr = 0;
//       for (let valve of valves) {
//         move(curr, valve.id);
//         if (time == 0) break;
//         curr = valve.id;
//         time--;
//         if (time == 0) break;
//         released += releasing;
//         releasing += valve.flow;
//       }
//       if (time > 0) {
//         released += releasing * time;
//       }
//       if (released > best) {
//         best = released;
//         //   console.log(valves, best);
//       }
//     };
//     let genPerm = (k: number, a: Valve[]) => {
//       if (k == 1) {
//         run(a);
//       } else {
//         genPerm(k - 1, a);
//         for (let i = 0; i < k - 1; i++) {
//           let tmp = a[k - 1];
//           if (k & 1) {
//             a[k - 1] = a[0];
//             a[0] = tmp;
//           } else {
//             a[k - 1] = a[i];
//             a[i] = tmp;
//           }
//           genPerm(k - 1, a);
//         }
//       }
//     };
//     let tmpList = valveList.filter((a) => a.flow);
//     //   tmpList.sort((a, b) => b.flow - a.flow);
//     //   console.log(tmpList);
//     genPerm(tmpList.length, tmpList);
//     return best;
//   };
