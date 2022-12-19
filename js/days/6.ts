import _ from "lodash";
import { parseNumsLines } from "../util";

export const run = (input: string) => {
  let p1 = 0;
  for (let i = 0; i < input.length - 4; i++) {
    let found = true;
    for (let j = 0; j < 4; j++) {
      for (let k = j + 1; k < 4; k++) {
        if (input[i + j] == input[i + k]) {
          found = false;
          break;
        }
      }
    }
    if (found) {
      p1 = i + 4;
      break;
    }
  }
  var p2 = 0;
  for (let i = 0; i < input.length - 14; i++) {
    let found = true;
    for (let j = 0; j < 14; j++) {
      for (let k = j + 1; k < 14; k++) {
        if (input[i + j] == input[i + k]) {
          found = false;
          break;
        }
      }
    }
    if (found) {
      p2 = i + 14;
      break;
    }
  }
  return [p1, p2];
};
