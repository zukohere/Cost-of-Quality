//////// Good/Defective Indicators

var indicData = [
  {
    type: "indicator",
    // mode: "number+gauge+delta",
    mode: "number+gauge",
    gauge: {
      shape: "bullet", 'bar': { 'color': "green" },
      axis: { range: [0, inUnits], visible: false }
    },
    // delta: { reference: inUnits },
    value: inUnits,
    domain: { x: [0, 0.45], y: [0.5, 0.75] },
    title: { text: "<b style= 'font-size:0.7em'>Quality</b><br><span style='color: gray; font-size:0.6em'></span>" }
  },
  {
    type: "indicator",
    // mode: "number+gauge+delta",
    mode: "number+gauge",
    gauge: {
      shape: "bullet", 'bar': { 'color': "red" },
      axis: { range: [0, inUnits], visible: false }
    },
    // delta: { reference: 0 },
    value: 0,
    domain: { x: [0, 0.45], y: [0, 0.25] },
    title: { text: "<b style= 'font-size:0.7em'>Defective</b><br><span style='color: gray; font-size:0.6em'>(Units)</span>" }
  }
];







////////////////// COPQ Indicators

// Base
netSales = data.unitSales * inUnits
coqAxismax = d3.sum(pieUnits.map(d => d.unitCost)) / netSales
console.log(coqAxismax)
indCOPQ = 0
indCOGQ = 0
indCOQ = 0


var coqData = [
  {
    type: "indicator",
    mode: "number+gauge+delta",
    value: indCOPQ,
    number: { valueformat: ".3%" },
    domain: { x: [.65, 1], y: [2 / 3, 1] },
    delta: {
      reference: data.copqGoal, position: "top",
      decreasing: { color: "green" }, increasing: { color: "red" }, valueformat: ".3%"
    },
    title: {
      text:
        "<b>COPQ</b><br><span style='color: gray; font-size:0.8em'></span>",
      font: { size: 14 }
    },
    gauge: {
      shape: "bullet",
      axis: { range: [0, coqAxismax], visible: false },
      threshold: {
        line: { color: "red", width: 2, gradient: { yanchor: "vertical" } },
        thickness: 0.75,
        value: data.copqGoal
      },
      bgcolor: "white",

      bar: { color: colorLookup["COPQ"] }
    }
  },
  {
    type: "indicator",
    mode: "number+gauge+delta",
    value: indCOGQ,
    number: { valueformat: ".3%" },
    domain: { x: [.65, 1], y: [1 / 3, 2 / 3] },
    delta: {
      reference: data.cogqGoal, position: "top",
      decreasing: { color: "green" }, increasing: { color: "red" }, valueformat: ".3%"
    },
    title: {
      text:
        "<b>COGQ</b><br><span style='color: gray; font-size:0.8em'></span>",
      font: { size: 14 }
    },
    gauge: {
      shape: "bullet",
      axis: { range: [0, coqAxismax], visible: false },
      threshold: {
        line: { color: "red", width: 2, gradient: { yanchor: "vertical" } },
        thickness: 0.75,
        value: data.cogqGoal
      },
      bgcolor: "white",
      bar: { color: colorLookup["COGQ"] }
    }
  },
  {
    type: "indicator",
    mode: "number+gauge+delta",
    value: indCOQ,
    number: { valueformat: ".3%" },
    domain: { x: [.65, 1], y: [0, 1 / 3] },
    delta: {
      reference: data.copqGoal + data.cogqGoal, position: "top",
      decreasing: { color: "green" }, increasing: { color: "red" }, valueformat: ".3%"
    },
    title: {
      text:
        "<b>Overall COQ</b><br><span style='color: gray; font-size:0.8em'>(% of Net Sales)</span>",
      font: { size: 14 }
    },
    gauge: {
      shape: "bullet",
      axis: { range: [0, coqAxismax], visible: false },
      threshold: {
        line: { color: "red", width: 2, gradient: { yanchor: "vertical" } },
        thickness: 0.75,
        value: data.copqGoal + data.cogqGoal
      },
      bgcolor: "white",
      bar: { color: "darkblue" }
    }
  }
];

var combinedData = indicData.concat(coqData)
var config_COQ = { responsive: true };

var layout_COQ = {
  width: 1000, height: 150,
  margin: { t: 20, r: 25, l: 100, b: 10 }
};
Plotly.newPlot('plotly_COQ', combinedData, layout_COQ, config_COQ);




/////////////////////////////////////////////////////////////////////////////////////////////

function updateIndicator(unitInidcator) {

  defectUnits = d3.sum(unitInidcator.filter(d => d.sGorP === "COPQ" && d.terminal === true).map(d => d.units))
  goodUnits = inUnits - defectUnits

  // Plotly.restyle(d3.selectAll("#plotly_ind").node(), "value", [])

  // targetUnits structure [{ "node", "terminal", "units", "unitCost", "sColor", "sGorP"}]
  indCOPQ = d3.sum(unitInidcator.filter(d => d.sGorP === "COPQ").map(d => d.unitCost)) / netSales
  indCOGQ = d3.sum(unitInidcator.filter(d => d.sGorP === "COGQ").map(d => d.unitCost)) / netSales
  indCOQ = (indCOPQ + indCOGQ)
  console.log("indCOQ: " + indCOQ)
  Plotly.restyle(d3.selectAll("#plotly_COQ").node(), "value", [goodUnits, defectUnits, indCOPQ, indCOGQ, indCOQ])

}
/////// Defect Bullet tips
svg = d3.select("#Bullet_titles")
var tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([50, 0])
  .html("I'm a tool tip!");
svg.call(tool_tip);

svg.append("g")
  .append("text")
  .attr("x", +svg.attr("width") / 4)
  .attr("y", +svg.attr("height") / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("text-decoration", "underline")
  .text("Defective Unit Counter")
  .on('mouseover', tool_tip.show)
  .on('mouseout', tool_tip.hide);

/////// COQ tips
svg = d3.select("#Bullet_titles")
var tool_tip1 = d3.tip()
  .attr("class", "d3-tip")
  .offset([50, 0])
  .html("I'm a tool tip also!");
svg.call(tool_tip1);

svg.append("g")
  .append("text")
  .attr("x", 3 * +svg.attr("width") / 4)
  .attr("y", +svg.attr("height") / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("text-decoration", "underline")
  .text("Cost of Quality (COQ) as % of Net Sales")
  .on('mouseover', tool_tip1.show)
  .on('mouseout', tool_tip1.hide);