const mockMathRandomAlternate = () => {
  beforeEach(() => {
    jest.spyOn(Math, "random");

    let idx = -1;

    (Math.random as jest.MockedFunction<typeof Math.random>).mockImplementation(
      () => {
        idx += 1;

        return idx % 2;
      }
    );
  });

  afterEach(() => {
    (Math.random as jest.MockedFunction<typeof Math.random>).mockRestore();
  });
};

export { mockMathRandomAlternate };
