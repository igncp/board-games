// @flow

type T_padWithZeros = (number, number) => string

export const padWithZeros: T_padWithZeros = (number, len) => {
  let my_string = `${number}`

  while (my_string.length < len) {
    my_string = `0${my_string}`
  }

  return my_string
}

type T_getDoesArrayContainDuplicates = <T: *>([T, T, T] | [T, T] | Array<T>) => boolean

export const getDoesArrayContainDuplicates: T_getDoesArrayContainDuplicates = (arr) => {
  const newArr = arr.slice(0)

  newArr.sort()

  for (let i = 0; i < arr.length; i++) {
    if (newArr[i] === newArr[i - 1]) {
      return true
    }
  }

  return false
}

export const getRandomItem = <T>(items: Array<T>): T => {
  const index = Math.floor(Math.random() * items.length)

  return items[index]
}

export const removeOneItemOfArr = <T>(item: T, items: Array<T>): void => {
  for (let i = 0; i < items.length; i++) {
    const idxItem = items[i]

    if (item === idxItem) {
      items.splice(i, 1)

      return
    }
  }
}

export const getNRandomItems = <T>(num: number, items: [T, T] | [T, T, T] | Array<T>): Array<T> => {
  const randomItems = []
  const itemsArr = items.slice(0)

  for (let i = 0; i < num; i++) {
    if (itemsArr.length === 0) {
      throw new Error("Not enough items")
    }

    const index = Math.floor(Math.random() * itemsArr.length)

    randomItems.push(itemsArr[index])
    itemsArr.splice(index, 1)
  }

  return randomItems
}
