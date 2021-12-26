//////// Good/Defective Indicators

var indicData = [
    {
        type: "indicator",
        // mode: "number+gauge+delta",
        mode: "number+gauge",
        gauge: {
            shape: "bullet", 'bar': { 'color': "green" },
            axis: { range:[0,inUnits], visible: false }
        },
        // delta: { reference: inUnits },
        value: inUnits,
        domain: { x: [0, 1], y: [0.5, 0.75] },
        title: { text: "<b style= 'font-size:0.7em'>Quality</b><br><span style='color: gray; font-size:0.6em'>(Units)</span>"}
    },
    {
        type: "indicator",
        // mode: "number+gauge+delta",
        mode: "number+gauge",
        gauge: {
            shape: "bullet", 'bar': { 'color': "red" },
            axis: { range:[0,inUnits], visible: false }
        },
        // delta: { reference: 0 },
        value: 0,
        domain: { x: [0, 1], y: [0, 0.25] },
        title: { text: "<b style= 'font-size:0.7em'>Defective</b><br><span style='color: gray; font-size:0.6em'>(Units)</span>"} 
    }
];

var layout = {
    width: 400, height: 150,
    margin: { t: 10, r: 25, l: 200, b: 10 }
}


Plotly.newPlot('plotly_ind', indicData, layout);


////////////////// COPQ Indicators

// Base
netSales = data.unitSales
coqAxismax = d3.sum(pieUnits.map(d=>d.unitCost))/netSales
console.log(coqAxismax)
indCOPQ = 0
indCOGQ = 0
indCOQ = 0
var layout_COQ = { width: 400, height: 300 };

var coqData = [
    {
      type: "indicator",
      mode: "number+gauge+delta",
      value: indCOPQ,
      number: {valueformat:".3%"},
      domain: { x: [0, 1], y: [2/3, 1] },
      delta: { reference: data.copqGoal, position: "top", 
      decreasing: {color: "green"}, increasing:{color: "red"}, valueformat: ".3%"},
      title: {
        text:
          "<b>COPQ</b><br><span style='color: gray; font-size:0.8em'>U.S. $</span>",
        font: { size: 14 }
      },
      gauge: {
        shape: "bullet",
        axis: { range:[0,coqAxismax], visible: false },
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
        number: {valueformat:".3%"},
        domain: { x: [0, 1], y: [1/3, 2/3] },
        delta: { reference: data.cogqGoal, position: "top", 
        decreasing: {color: "green"}, increasing:{color: "red"}, valueformat: ".3%"},
        title: {
          text:
            "<b>COGQ</b><br><span style='color: gray; font-size:0.8em'>U.S. $</span>",
          font: { size: 14 }
        },
        gauge: {
          shape: "bullet",
          axis: { range:[0,coqAxismax], visible: false },
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
        number: {valueformat:".3%"},
        domain: { x: [0, ], y: [0, 1/3] },
        delta: { reference: data.copqGoal+data.cogqGoal, position: "top",
        decreasing: {color: "green"}, increasing:{color: "red"}, valueformat: ".3%"},
        title: {
          text:
            "<b>Overall<br>COQ</b><br><span style='color: gray; font-size:0.8em'>U.S. $</span>",
          font: { size: 14 }
        },
        gauge: {
          shape: "bullet",
          axis: { range:[0,coqAxismax], visible: false },
          threshold: {
            line: { color: "red", width: 2, gradient: { yanchor: "vertical" } },
            thickness: 0.75,
            value: data.copqGoal+data.cogqGoal
          },
          bgcolor: "white",
          bar: { color: "darkblue" }
        }
      }
  ];
  
  
  var config_COQ = { responsive: true };

    
Plotly.newPlot('plotly_COQ', coqData, layout_COQ,config_COQ);




/////////////////////////////////////////////////////////////////////////////////////////////

function updateIndicator(unitInidcator) {
   
    defectUnits = d3.sum(unitInidcator.filter(d=>d.sGorP === "COPQ" && d.terminal === true).map(d=>d.units))
    goodUnits = inUnits-defectUnits

    Plotly.restyle(d3.selectAll("#plotly_ind").node(), "value", [goodUnits, defectUnits])

    // targetUnits structure [{ "node", "terminal", "units", "unitCost", "sColor", "sGorP"}]

}

function updateCOQ(unitData) {
    indCOPQ = d3.sum(unitData.filter(d=>d.sGorP==="COPQ").map(d=>d.unitCost))/netSales
    indCOGQ = d3.sum(unitData.filter(d=>d.sGorP==="COGQ").map(d=>d.unitCost))/netSales
    indCOQ = (indCOPQ+indCOGQ)
    console.log("indCOQ: "+indCOQ)
    Plotly.restyle(d3.selectAll("#plotly_COQ").node(), "value", [indCOPQ, indCOGQ, indCOQ])

}

