import _ from "lodash";
import { parseNumsLines } from "../util";

interface Dir {
  name: string;
  children: Partial<Record<string, Dir>>;
  files: File[];
  parent: Dir;
  size: bigint;
}
interface File {
  name: string;
  size: bigint;
}
export const run = (input: string) => {
  let lines = input.split("\n");
  let root: Dir = {
    name: "",
    children: {},
    files: [],
    parent: {} as Dir,
    size: 0n,
  };
  root.parent = root;
  let curr = root;
  for (let i = 1; i < lines.length; i++) {
    let line = lines[i].split(" ");
    if (line[0] == "$") {
      switch (line[1]) {
        case "cd":
          if (line[2] == "..") curr = curr.parent;
          else {
            let name = line[2];
            if (!curr.children[name]) {
              curr.children[name] = {
                name,
                children: {},
                parent: curr,
                files: [],
                size: 0n,
              };
            }
            curr = curr.children[name]!;
          }
          break;
      }
    } else {
      if (line[0] == "dir") {
        let name = line[1];
        if (!curr.children[name]) {
          curr.children[name] = {
            name,
            children: {},
            parent: curr,
            size: 0n,
            files: [],
          };
        }
      } else {
        curr.files.push({
          name: line[1],
          size: BigInt(line[0]),
        });
      }
    }
  }
  let ra = (node: Dir): bigint => {
    node.size += Object.values(node.children).reduce((p, c) => p + ra(c!), 0n);
    node.size += node.files.reduce((p, c) => p + c.size, 0n);
    return node.size;
  };
  let recurse = (node: Dir): bigint => {
    // console.log(`${node.name}: ${node.size}`);
    let count = 0n;
    count += Object.values(node.children).reduce((p, c) => p + recurse(c!), 0n);
    if (node.size <= 100000n) {
      count += node.size;
    }
    // console.log(count);
    return count;
  };

  let recurse2 = (node: Dir, unused: bigint): bigint => {
    let v = Object.values(node.children).reduce((p, c) => {
      let v = recurse2(c!, unused);
      if (v < 0) return p;
      if (p < 0) return v;
      if (p < v) return p;
      return v;
    }, -1n);
    if (node == root) return v;
    // console.log(root.size - node.size);
    if (node.size >= unused) {
      // console.log(v);
      if (v < 0) return node.size;
      if (node.size < v) return node.size;
      return v;
    } else {
      return -1n;
    }
  };
  ra(root);
  //   console.log(root);
  return [recurse(root), recurse2(root, 30000000n - (70000000n - root.size))];
};
