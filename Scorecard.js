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
        title: { text: "Good Units" }
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
        title: { text: "Defective Units" }
    }
];

var layout = {
    width: 500, height: 150,
    margin: { t: 10, r: 25, l: 200, b: 10 }
}


Plotly.newPlot('plotly_ind', indicData, layout);

function updateIndicator(unitInidcator) {
   
    defectUnits = d3.sum(unitInidcator.filter(d=>d.sGorP === "COPQ" && d.terminal === true).map(d=>d.units))
    goodUnits = inUnits-defectUnits

    // indicData[0].value = goodUnits
    // indicData[1].value = defectUnits
    // console.log(indicData[0].value)
    Plotly.restyle(d3.selectAll("#plotly_ind").node(), "value", [goodUnits, defectUnits])

    // targetUnits structure [{ "node", "terminal", "units", "unitCost", "sColor", "sGorP"}]

}