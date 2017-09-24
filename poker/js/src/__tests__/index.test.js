const mockMain = jest.fn()

jest.mock("../main", () => mockMain)

describe("index", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it("automatically calls main", () => {
    require("..")

    expect(mockMain.mock.calls).toEqual([[]])
  })
})
