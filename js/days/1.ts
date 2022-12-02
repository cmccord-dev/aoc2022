
import _ from 'lodash'
import { parseNumsLines } from '../util'

export const run = (input: string) => {
    let elves = input.trim().split('\n\n').map(parseNumsLines).map(a => a.sum());
    elves.sort((a, b) => b - a);
    return [elves[0], elves.take(3).sum()]
}