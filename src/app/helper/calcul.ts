export function sum(arr: number[]) {
  return arr.reduce((acc, cur) => acc + cur, 0);
}

// input: [1,3,2,5]
// result	[1,4,6,11]
export function runningSum(arr: number[]) {
  return arr.reduce((acc, cur, index) => {
    const total = index === 0 ? arr[0] : acc[index - 1] + cur;
    acc.push(total);
    return acc;
  }, [] as number[]);
}
