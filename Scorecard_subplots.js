// https://plotly.com/javascript/indicator/
//////// Good/Defective Indicators
function drawIndicators(pieUnits,iData) {
  inUnits = iData.inUnits
  cogqgoal = iData.cogqGoal
  copqgoal = iData.copqGoal
  netSales = iData.unitSales * inUnits
  
var indicData = [
  {
    type: "indicator",
    mode: "number+gauge",
    gauge: {
      shape: "bullet", 'bar': { 'color': "green" },
      axis: { range: [0, inUnits], visible: false }
    },
    value: inUnits,
    domain: { x: [0, 0.3], y: [0.6, .8] },
    title: { text: "<b>Quality</b></span>" , font: { size: 14 }}
  },
  {
    type: "indicator",
    mode: "number+gauge",
    gauge: {
      shape: "bullet", 'bar': { 'color': "red" },
      axis: { range: [0, inUnits], visible: false }
    },
    value: 0,
    domain: { x: [0, 0.3], y: [0.2, 0.4] },
    title: {text: "<b>Defective<br></b><span style='color: gray; font-size:0.8em'>(Units)</span>", font: { size: 14 }}
  }
];

/////////// Net Sales
var nsIndicator = [{
  type: "indicator",
  mode: "number",
  value: netSales, 
  number: { valueformat: "$,", font: {size: 30} },
  domain: { x: [.275, .67], y: [.66, 1] },
}]





////////////////// COPQ Indicators

coqAxismax = d3.sum(pieUnits.map(d => d.unitCost)) / netSales
indCOPQ = 0
indCOGQ = 0
indCOQ = 0


var coqData = [
  {
    type: "indicator",
    mode: "number+gauge+delta",
    value: indCOPQ,
    number: { valueformat: ".3%" },
    domain: { x: [.75, 1], y: [2 / 3, 1] },
    delta: {
      reference: copqgoal, position: "top",
      decreasing: { color: "green" }, increasing: { color: "red" }, valueformat: ".3%"
    },
    title: {
      text:
        "<b>COPQ</b><br><span style='color: gray; font-size:0.8em'></span>",
      font: { size: 14 }
    },
    gauge: {
      shape: "bullet",
      axis: { range: [0, d3.max([coqAxismax,copqgoal])], visible: false },
      threshold: {
        line: { color: "red", width: 2, gradient: { yanchor: "vertical" } },
        thickness: 0.75,
        value: copqgoal
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
    domain: { x: [.75, 1], y: [1 / 3, 2 / 3] },
    delta: {
      reference: cogqgoal, position: "top",
      decreasing: { color: "green" }, increasing: { color: "red" }, valueformat: ".3%"
    },
    title: {
      text:
        "<b>COGQ</b><br><span style='color: gray; font-size:0.8em'></span>",
      font: { size: 14 }
    },
    gauge: {
      shape: "bullet",
      axis: { range: [0, d3.max([coqAxismax,cogqgoal])], visible: false },
      threshold: {
        line: { color: "red", width: 2, gradient: { yanchor: "vertical" } },
        thickness: 0.75,
        value: cogqgoal
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
    domain: { x: [.75, 1], y: [0, 1 / 3] },
    delta: {
      reference: cogqgoal + copqgoal, position: "top",
      decreasing: { color: "green" }, increasing: { color: "red" }, valueformat: ".3%"
    },
    title: {
      text:
        "<b>Overall COQ</b><br><span style='color: gray; font-size:0.8em'>(% of Net Sales)</span>",
      font: { size: 14 }
    },
    gauge: {
      shape: "bullet",
      axis: { range: [0, d3.max([coqAxismax,cogqgoal+copqgoal])], visible: false },
      threshold: {
        line: { color: "red", width: 2, gradient: { yanchor: "vertical" } },
        thickness: 0.75,
        value: cogqgoal + copqgoal
      },
      bgcolor: "white",
      bar: { color: "darkblue" }
    }
  }
];

var combinedData = indicData.concat(nsIndicator).concat(coqData)
var config_COQ = { responsive: true };

var layout_COQ = {
  width: 1000, height: 150,
  margin: { t: 20, r: 25, l: 100, b: 10 }
};
Plotly.newPlot('plotly_COQ', combinedData, layout_COQ, config_COQ);

/////// Defect Bullet tips
svg = d3.select("#Bullet_titles")
var tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([50, 0])
  .html("This bullet chart displays the number of quality vs. defective units in the model.");
svg.call(tool_tip);

svg.append("g")
  .append("text")
  .attr("x", +svg.attr("width") / 5)
  .attr("y", +svg.attr("height") / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("text-decoration", "underline")
  .text("Defective Unit Counter")
  .on('mouseover', tool_tip.show)
  .on('mouseout', tool_tip.hide);
///// Net Sales tips
svg = d3.select("#Bullet_titles")
var tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([50, 0])
  .html("Sales Dollars per Unit times the number of Input Units");
svg.call(tool_tip);

svg.append("g")
  .append("text")
  .attr("x", +svg.attr("width") / 1.95)
  .attr("y", +svg.attr("height") / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("text-decoration", "underline")
  .text("Net Sales")
  .on('mouseover', tool_tip.show)
  .on('mouseout', tool_tip.hide);

/////// COQ tips
svg = d3.select("#Bullet_titles")
var tool_tip1 = d3.tip()
  .attr("class", "d3-tip")
  .offset([100, 0])
  .html("This bullet chart measures the the Cost of Poor Quality, "+
  "<br> Cost of Good Quality and Overall Cost of Quality as a "+
  "<br> Percent of the Total Net Sales (The product of Sales $/Unit and Input Units)."+
  "<br> The red bars represent the threshold goal levels."+
  "<br> The gauge values display percentage points above/below goal.");
svg.call(tool_tip1);

svg.append("g")
  .append("text")
  .attr("x", 4.15 * +svg.attr("width") / 5)
  .attr("y", +svg.attr("height") / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("text-decoration", "underline")
  .text("COQ as % of Net Sales")
  .on('mouseover', tool_tip1.show)
  .on('mouseout', tool_tip1.hide);


}


/////////////////////////////////////////////////////////////////////////////////////////////

function updateIndicator(unitIndicator,iData) {
  inUnits = iData.inUnits
  cogqgoal = iData.cogqgoal
  copqgoal = iData.copqgoal
  netSales = iData.unitSales * inUnits
  defectUnits = d3.sum(unitIndicator.filter(d => d.sGorP === "COPQ" && d.terminal === true).map(d => d.unitCount))
  goodUnits = inUnits - defectUnits
  console.log(unitIndicator)


  indCOPQ = d3.sum(unitIndicator.filter(d => d.sGorP === "COPQ").map(d => d.unitCost)) / netSales
  indCOGQ = d3.sum(unitIndicator.filter(d => d.sGorP === "COGQ").map(d => d.unitCost)) / netSales
  indCOQ = (indCOPQ + indCOGQ)
  
  Plotly.restyle(d3.selectAll("#plotly_COQ").node(), "value", [goodUnits, defectUnits, netSales, indCOPQ, indCOGQ, indCOQ])
  
}
