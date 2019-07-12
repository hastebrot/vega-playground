import * as df from "dataflow-api"
import * as vega from "vega-dataflow"

describe("dataflow api", () => {
  test("default", () => {
    const flow = df.dataflow([
      df
        .aggregate()
        .groupby(["category"])
        .measure([df.count(), df.sum("amount").as("sum")]),
    ])

    flow.insert([
      { category: "a", amount: 12 },
      { category: "a", amount: 5 },
      { category: "b", amount: 11 },
    ])

    expect(flow.values()).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "a",
          "count": 2,
          "sum": 17,
          Symbol(vega_id): 4,
        },
        Object {
          "category": "b",
          "count": 1,
          "sum": 11,
          Symbol(vega_id): 5,
        },
      ]
    `)
  })
})

describe("dataflow", () => {
  test("success", () => {
    const df = new vega.Dataflow()

    const s1 = df.add(10)
    const s2 = df.add(3)
    const n1 = df.add(it => it.s1 + 0.25, { s1 })
    const n2 = df.add(it => it.n1 * it.s2, { n1, s2 })
    const op = [s1, s2, n1, n2]
    const stamp = it => it.stamp
    expect(df.stamp()).toEqual(0)

    df.run()
    expect(df.stamp()).toEqual(1)
    expect(op.map(stamp)).toEqual([1, 1, 1, 1])
    expect(n2.value).toEqual(30.75) // (10 + 0.25) * 3.
  })

  test("error", () => {
    const df = new vega.Dataflow()

    let error = 0
    df.error = () => {
      error = 1
    }
    df.add(() => {
      throw Error("!!!")
    })

    df.run()
    expect(error).toEqual(1)
  })
})
