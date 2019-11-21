type RunNTimes = (n: number, fn: (num?: number) => void) => Promise<void>;

export const runNTimes: RunNTimes = async (n, fn) => {
  for (let i = 0; i < n; i++) {
    await fn(i);
  }
};

type GetRandomIntegerInRange = (min: number, max: number) => number;

export const getRandomIntegerInRange: GetRandomIntegerInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
