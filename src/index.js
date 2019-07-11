import { Box } from "fannypack"
import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import VegaLite from "react-vega-lite"
import "typeface-public-sans"
import * as vega from "vega"
import * as vegalite from "vega-lite"
import * as vl from "vega-lite-api"
import results from "./results-2010.json"

const transforms = [
  vl.calculate("parseInt(datum.round)").as("round"),
  vl.groupby("driver").window({
    op: "sum",
    field: "points",
    as: "points_sum",
  }),
  vl.groupby("driver").joinaggregate({
    op: "max",
    field: "points_sum",
    as: "points_max",
  }),
  vl.filter("datum.points_max >= 100"),
  vl
    .calculate("datum.firstName + ' ' + datum.lastName + ' (' + datum.points_max + ' points)'")
    .as("driver"),
]

const lineLayer = vl.markLine().encode(
  vl
    .y()
    .fieldQ("points_sum")
    .title("Points"),
  vl
    .x()
    .fieldO("round")
    .title("Round")
    .axis({ grid: true }),
  vl
    .color()
    .fieldN("driver")
    .title("Drivers")
    .sort({ field: "points_max", order: "descending" })
)

// vl.register(vega, vegalite, {})

const spec = vl
  .data()
  .transform(...transforms)
  .layer(lineLayer)
  .title("2010 Formula One World Championship")
  .width(400)
  .height(300)
  .toSpec()

const data = {
  values: results,
}

// const toPoints = position => {
//   const points = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
//   if (position && points[position - 1]) {
//     return points[position - 1]
//   }
//   return 0
// }

export const Application = ({ ...otherProps }) => {
  return (
    <Fragment>
      <Box style={{ fontFamily: "public sans" }} {...otherProps}>
        application
      </Box>
      {/* <div ref={ref => ref && ref.append(node)} /> */}
      <VegaLite spec={spec} data={data} />
    </Fragment>
  )
}

export const rootNode = document.querySelector("#root")

ReactDOM.render(
  <Fragment>
    <Application />
  </Fragment>,
  rootNode
)
