// @flow

export function getRandomItem<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error("You should not pass an empty array to getRandomItem")
  }

  return items[Math.floor(Math.random() * items.length)]
}

let currentId: number = 0

export function generateId():number {
  currentId += 1

  return currentId
}

export function log(data: any) {
  console.log(JSON.stringify(data, null, 4))
}

export function getArrOfLen(length: number): number[] {
  return [...Array(length).keys()]
}

type SmallNumberTuple = [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number]

export function anyInTupleIsPositiveOrZero(a: SmallNumberTuple): boolean {
  return Boolean(a.find((n: number):boolean => n >= 0))
}
