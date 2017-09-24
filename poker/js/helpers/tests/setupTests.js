const origMathRandom = Math.random
const origConsole = global.console

afterEach(() => {
  Math.random = origMathRandom
  global.console = origConsole
})
