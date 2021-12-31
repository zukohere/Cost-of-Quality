function formTable() {
    d3.selectAll("#userTablesArea").selectAll("table").html("")
    // get the original data
    d3.json(dataSelect(), function (err, data) {

        rawdata = data.data
        
        ///////////////////////////// PROBABILITY TABLE
        // set up the table
        var table = d3.select("#inputTable").append("table").attr("border", 1);

        //create header row
        var header = table.append("thead").append("tr");
        header
            .selectAll("th")
            .data(["Source Node", "Target Node", "Probability(%)"])
            .enter()
            .append("th")
            .text(d => { return d })
            .attr("id", d => { return d.replace("(%)", "") })

        row = []
        sourceArray = [...new Set(Array.from(rawdata.links, d => d.source))]
        // ind = rawdata.links.length length not needed since doing i in which uses index.


        for (n in rawdata.links) {
            sourceLinks = rawdata.links.filter(d => d.source === rawdata.links[n].source)
            // Always add a row
            row[n] = table.append("tr")
            
            // if it's the first time the source is coming up, append the td for the source.
            if (rawdata.links[n] === sourceLinks[0]) {
                sourceCell = row[n]
                    .append("td")
                    .attr("class", "border_bottom")
                    .text(rawdata.links[n].source)
                    .attr("rowspan", sourceLinks.length)
                    
            }
            // otherwise go straight to appending the td's for target and value 
            targetCell = row[n]
                .append("td")
                if (+n===rawdata.links.length-1 || (n<rawdata.links.length-1 && rawdata.links[n].source != rawdata.links[+n+1].source))
                {targetCell.attr("class", "border_bottom")}
                targetCell.text(rawdata.links[n].target)
            valueCell = row[n]
                .append("td")
                if (+n===rawdata.links.length-1 || (n<rawdata.links.length-1 && rawdata.links[n].source != rawdata.links[+n+1].source))
                {valueCell.attr("class", "border_bottom")}
                valueCell.append("input")
                .attr("type", "text")
                .style("width", "60px")
                .attr("id", rawdata.links[n].source + "-->" + rawdata.links[n].target)
                .attr("name", rawdata.links[n].target)
                .attr("value", rawdata.links[n].units + "%")
                .text()

        }

        valueKeys = Object.entries(rawdata).slice(0, 4)

        ///////////////////////////////////// INPUT QUANTITY NET SALES AND GOALS
        var valueTable = d3.select("#valueTable").append("table").attr("border", 1);
        //create header row
        var header = valueTable.append("thead").append("tr");

        header
            .selectAll("th")
            .data(["Parameter", "Value"])
            .enter()
            .append("th")
            .text(d => { return d })

        row = []

        formatLookup = { "inUnits": ",", "unitSales": "$,", "copqGoal": ".3%", "cogqGoal": ".3%" }
        titleLookup = { "inUnits": "Input Units (#)", "unitSales": "Sales $/unit", "copqGoal": "COPQ Goal Level (%)", "cogqGoal": "COGQ Goal Level (%)" }
        for (n in valueKeys) {
            fmt = d3.format(formatLookup[valueKeys[n][0]])

            row[n] = valueTable.append("tr")
            nameCell = row[n]
                .append("td")
                .text(titleLookup[valueKeys[n][0]])
            valueCell = row[n]
                .append("td")
                .append("input")
                .attr("type", "text")
                .style("width", "75px")
                .attr("id", valueKeys[n][0])
                .attr("name", titleLookup[valueKeys[n][0]])
                .attr("value", fmt(valueKeys[n][1]))
        }

        // ///////////////////////////////////// INPUT NODE COSTS
        var costTable = d3.select("#costTable").append("table").attr("border", 1);
        //create header row
        var header = costTable.append("thead").append("tr");

        header
            .selectAll("th")
            .data(["Operation", "Cost/Unit"])
            .enter()
            .append("th")
            .text(d => { return d })

        row = []

        for (n in rawdata.nodes) {
            fmt = d3.format("$")

            row[n] = costTable.append("tr")
            nameCell = row[n]
                .append("td")
                .text(rawdata.nodes[n].name)
            valueCell = row[n]
                .append("td")
                .append("input")
                .attr("type", "text")
                .style("width", "75px")
                .attr("id", rawdata.nodes[n].name)
                .attr("name", rawdata.nodes[n].name)
                .attr("value", fmt(rawdata.nodes[n].cost))


        }


    })
    
}
function submitData() {
    //get original data
    d3.json(dataSelect(), function (err, data) {


        rawdata = data.data
        

        costTabInputs = d3.select("#costTable").selectAll("input").nodes()
        
        for (d3node of costTabInputs) {
            operation = rawdata.nodes.find(d => d.name === d3node.name)
            if (d3node.value.includes("%")) { operation.cost = d3node.value.replace("%", "").replace("$", "").replace(",", "") / 100 }
            else { operation.cost = +d3node.value.replace("$", "").replace(",", "") }
            checkInputs(d3node.value, d3node.name)
        }

        valueTabInputs = d3.select("#valueTable").selectAll("input").nodes()
        for (d3node of valueTabInputs) {
            if (d3node.value.includes("%")) { rawdata[d3node.id] = d3node.value.replace("%", "").replace("$", "").replace(",", "") / 100 }
            else { rawdata[d3node.id] = d3node.value.replace("$", "").replace(",", "") }
            checkInputs(d3node.value, d3node.name)
            
        }

        ////////// Probability vs Known Value Models
        
        if (d3.select("#modelType").node().value === "probVal") {
            ///// Updates probability in the rawdata
            probTabInputs = d3.select("#inputTable").selectAll("input").nodes()
            for (d3node of probTabInputs) {
                nSource = d3node.id.split("-->")[0]
                nTarget = d3node.id.split("-->")[1]

                nLink = rawdata.links.find(d => d.source === nSource && d.target === nTarget)
                
                nLink.units = +d3node.value.replace("%", "").replace("$", "").replace(",", "")
                checkInputs(d3node.value, d3node.id)

            }
            //// Turns probability into "actual" counts of units and deals with rounding errors
            for (level of [...new Set(Array.from(rawdata.links, d => d.level))]) {
                links = rawdata.links.filter(d => d.level === level)
                for (link of links) {
                    prevLinks = rawdata.links.filter(d => d.target === link.source)
                    if (!link.unitCount) {
                        
                        if (level === 0) { link.unitCount = rawdata.inUnits* link.units / 100 }
                        else {

                            link.unitCount = Math.floor(link.units / 100 * d3.sum(Array.from(prevLinks, d => d.unitCount)))

                            if (link === links[links.length - 1])
                                while (d3.sum(rawdata.links.filter(d => d.source === link.source).map(d => d.unitCount)) <
                                    d3.sum(rawdata.links.filter(d => d.target === link.source).map(d => d.unitCount))) {
                                    var ind = getRandomIntInclusive(0, links.length - 1)
                                    links[ind].unitCount = links[ind].unitCount + 1 * (Math.random() * 100 < link.units)
                                }
                        }
                    
                    }
                }

            }
        }
        else if (d3.select("#modelType").node().value === "knownVal") {
            /// Known value model
            knownTabInputs = d3.select("#inputTable").selectAll("input").nodes()
            for (d3node of knownTabInputs) {
                nSource = d3node.id.split("-->")[0]
                nTarget = d3node.id.split("-->")[1]

                nLink = rawdata.links.find(d => d.source === nSource && d.target === nTarget)

                nLink.unitCount = d3node.value.replace("%", "").replace("$", "").replace(",", "")
                if (nLink === rawdata.links[0]) {
                    rawdata["inUnits"] = nLink.unitCount
                    alert("Overwriting Input Units with User's Known Count for "
                        + nSource + "-->" + nTarget + "=" + rawdata["inUnits"])
                }

            }

        }
        checkProbs()
        dataToDraw = rawdata
        
        drawUnits(dataToDraw)

    })

    /// helper function for Probability Model
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }
}


function modelChange() {
    // set input table to known values by changing header title and values to 0.
    if (d3.select("#modelType").node().value === "knownVal") {
        alert("CAUTION: Only launch the Known Value Model if all Unit Counts are specified in the model below.")
        d3.select("#Probability").text("Unit Count(#)")
        d3.select("#inputTable").selectAll("input").attr("value", 0)
    }
    // set input table to probability by changing header title and set values to original probs.
    else {
        d3.select("#Probability").text("Probability(%)")

        d3.json(dataSelect(), function (err, data) {
            d3.select("#inputTable").selectAll("input")
                .data(rawdata.links)
                .attr("value", d => d.units + "%")

        })
    }

}

function checkInputs(invalue, id) {
    if (isNaN(invalue.replace("%", "").replace("$", "").replace(",", ""))) {
        alert("Value: "+invalue+" is not valid input for "+id)
    }
}

function checkProbs() {
// if probVal then for each source node check the sum of the probs of each target equal 100%
// known value error checking is in draw-units
if (d3.select("#modelType").node().value==="probVal") {
    
    probTotalsNot100= {}

    for (source of rawdata.links.map(d=>d.source)){
        probTotal = 0
        for (target of rawdata.links.filter(d=>d.source === source).map(d=>d.target)){
            probTotal += rawdata.links.find(d=>d.source===source && d.target===target).units
        }
        if (probTotal!=100) {
            
            probTotalsNot100[source] = probTotal
        }
    }
        if (Object.keys(probTotalsNot100).length !=0) {
        alert("Probabilities from source do not sum to 100%. "+ JSON.stringify(probTotalsNot100))
        }
    }
}



function dataSelect() {
    
    var usrDataType = d3.select("#dataType").node().value
    if (usrDataType === "mfg") {
    path = "manufacture.json"
    }

    else 
    if (usrDataType === "pfr") {
        path = "PFR.json"
        }
        return path
    
}