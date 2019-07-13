import * as df from "dataflow-api"
import * as vega from "vega-dataflow"

describe("dataflow api", () => {
  test("default", () => {
    // given:
    const flow = df.dataflow([
      df
        .aggregate()
        .groupby(["category"])
        .measure([df.count(), df.sum("amount").as("sum")]),
    ])

    // when:
    flow.insert([
      { category: "a", amount: 12 },
      { category: "a", amount: 5 },
      { category: "b", amount: 11 },
    ])

    // then:
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
  test("propagate values", () => {
    // given:
    const df = new vega.Dataflow()

    const s1 = df.add(10)
    const s2 = df.add(3)
    const n1 = df.add(it => it.s1 + 0.25, { s1 })
    const n2 = df.add(it => it.n1 * it.s2, { n1, s2 })
    const op = [s1, s2, n1, n2]
    expect(df.stamp()).toEqual(0)

    // when:
    df.run()

    // then:
    expect(df.stamp()).toEqual(1)
    expect(op.map(it => it.stamp)).toEqual([1, 1, 1, 1])
    expect(n2.value).toEqual(30.75) // (10 + 0.25) * 3.
  })

  test("handle errors", () => {
    // given:
    const df = new vega.Dataflow()

    let lastError = null
    df.error = error => {
      lastError = error
    }
    df.add(() => {
      throw new Error("error")
    })

    // when:
    df.run()

    // then:
    expect(lastError).toEqual(new Error("error"))
  })

  test("changeset tuples", () => {
    // given:
    const data = [
      { key: "a", value: 1 },
      { key: "b", value: 2 },
      { key: "c", value: 3 },
      { key: "d", value: 6 },
    ]

    // when:
    const pulse = vega
      .changeset()
      .insert(data)
      .pulse(new vega.Pulse(), [])

    // then:
    expect(pulse.add).toEqual(data)
    expect(pulse.rem).toEqual([])
    expect(pulse.mod).toEqual([])
    expect(data.every(vega.tupleid)).toBeTruthy()

    // when:
    const pulse2 = vega
      .changeset()
      .modify(data[0], "value", 5)
      .pulse(new vega.Pulse(), data)

    // then:
    expect(pulse2.add).toEqual([])
    expect(pulse2.rem).toEqual([])
    expect(pulse2.mod).toEqual([data[0]])
    expect(data[0].value).toEqual(5)

    // when:
    const pulse3 = vega
      .changeset()
      .remove(data[0])
      .pulse(new vega.Pulse(), data)

    // then:
    expect(pulse3.add).toEqual([])
    expect(pulse3.rem).toEqual([data[0]])
    expect(pulse3.mod).toEqual([])
  })
})
