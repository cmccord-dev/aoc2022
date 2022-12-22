import _ from "lodash";
import { parseNumsLines } from "../util";

export const run = (input: string) => {
  let nums = parseNumsLines(input.trim());
  interface LL {
    value: number;
    next: LL;
    prev: LL;
    nextIter?: LL;
    ind: number;
  }
  let set: Set<number> = new Set();
  let arr: LL[] = [];
  let mul = Number(811589153n % BigInt(nums.length - 1));
  for (let i = 0; i < nums.length; i++) {
    set.add(nums[i]);
    arr[i] = {
      value: (nums[i] * mul) % (nums.length - 1),
      nextIter: undefined,
      next: undefined as unknown as LL,
      prev: undefined as unknown as LL,
      ind: nums[i],
    };
  }
  for (let i = 1; i < nums.length; i++) {
    arr[i - 1].nextIter = arr[i];
    arr[i - 1].next = arr[i];
    arr[i].prev = arr[i - 1];
  }
  //   arr[0].prev = arr[arr.length - 1];
  //   arr[arr.length - 1].next = arr[0];
  let root = arr[0];
  for (let i = 0; i < 10; i++) {
    let curr = root;
    //   console.log(arr[arr.length - 2]);
    for (let i = 0; i < arr.length; i++) {
      // console.log(arr.map((v) => v.value));
      if (curr.value) {
        let ind = arr.indexOf(curr);
        //   console.log(curr.value, ind);
        let dst = (ind + curr.value) % (arr.length - 1);
        //   console.log(dst);
        while (dst < 0) dst += arr.length - 1;
        //   if (dst < ind) {
        //     dst--;
        //     if (dst < 0) dst += arr.length;
        //   }
        arr.splice(ind, 1);
        if (dst) arr.splice(dst, 0, curr);
        else arr.push(curr);
      }
      curr = curr.nextIter!;
    }
  }
  let calLen = (v: number) => (v < 0 ? v + nums.length : v) % nums.length;
  //   for (let i = 0; i < nums.length; i++) {
  //     console.log(arr.map((a) => ({ ind: a.ind, value: a.value })));
  //     let v = arr[i];
  //     if (v.value == 0) continue;
  //     let curr = v.value < 0 ? v.prev : v.next;
  //     v.prev.next = v.next;
  //     v.next.prev = v.prev;
  //     for (let j = 1; j < Math.abs(v.value); j++) {
  //       curr.ind = calLen(curr.ind - Math.sign(v.value));
  //       curr = v.value < 0 ? curr.prev : curr.next;
  //     }
  //     curr.ind = calLen(curr.ind - Math.sign(v.value));
  //     v.next = curr.next;
  //     v.prev = curr.next.prev;
  //     v.prev.next = v;
  //     v.next.prev = v;
  //     v.ind = calLen(v.ind + v.value);
  //     // v.ind += v.value;
  //   }
  //   let curr = arr.find((v) => v.ind % arr.length == 0)!;
  //   let sum = 0;
  //   let newList: typeof arr = [];

  //   for (let i = 0; i < arr.length; i++) {
  //     newList.push(curr);
  //     // console.log(curr.ind % arr.length);
  //     curr = curr.next;
  //   }
  //   for (let i = 0; i < arr.length; i++) {
  //     console.log(`${arr[i].value}`);
  //   }
  //   console.log(arr.map((v) => v.value));
  let sum = 0n;
  let newList = arr;
  let base = arr.findIndex((a) => a.value == 0);
  for (let i = 1; i <= 3; i++) {
    let v = newList[(base + i * 1000) % newList.length];
    console.log(v.value);
    sum += BigInt(v.ind) * 811589153n;
  }
  return sum;
};
