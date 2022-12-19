

declare global {
    interface Array<T> {
        sum(): number
        take(n: number): T[]
    }
}

Array.prototype.sum = function () {
    return this.reduce((p, c) => p + c)
}
Array.prototype.take = function (n) {
    return this.slice(0, n)
}

export const parseNumsArr = (arr: string[]): number[] => {
    return arr.map(a => parseInt(a));
}
export const parseNumsDel = (arr: string, nl?: string): number[] => {
    return parseNumsArr(arr.split(nl ?? '\n'));
}
export const parseNumsLines = (arr: string): number[] => parseNumsDel(arr, '\n')
export default { };