// @flow

export function getArrOfLen(length: number): number[] {
  return [...Array(length).keys()]
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

let currentId: number = 0

export function generateId():number {
  currentId += 1

  return currentId
}

export function createShuffledArray<A>(items: A[]): A[] {
  const a: A[] = items.concat([])
  let i: number, j: number, x: A

  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i)
    x = a[i - 1]
    a[i - 1] = a[j]
    a[j] = x
  }

  return a
}

// istanbul ignore else
if (global.__TEST__) {
  module.exports._test = {
    setCurrentId: (v) => {
      currentId = v
    },
  }
}
