function formTable() {
    // get the original data
    d3.json("example-data.json", function (err, data) {
        

    rawdata = data.data
    console.log(rawdata)
    // set up the table
    var table = d3.select("#inputTable").append("table").attr("border", 1);

    //create header row
    var header = table.append("thead").append("tr");
    header
        .selectAll("th")
        .data(["Source Node", "Link Probability", "Value (%)"])
        .enter()
        .append("th")
        .text(d => { return d })

        row = []
        sourceArray = [...new Set(Array.from(rawdata.links, d => d.source))]
        // ind = rawdata.links.length length not needed since doing i in which uses index.
        
       
            for (n in rawdata.links){
            sourceLinks = rawdata.links.filter(d => d.source === rawdata.links[n].source)
            // Always add a row
            row[n] = table.append("tr")
                    // if it's the first time the source is coming up, append the td for the source.
                    if (rawdata.links[n]===sourceLinks[0]){
                    sourceCell = row[n]
                        .append("td")
                        .text(rawdata.links[n].source)
                        .attr("rowspan", sourceLinks.length)
                }
                // otherwise go straight to appending the td's for target and value 
                targetCell = row[n]
                    .append("td")
                    .text(rawdata.links[n].target)
                valueCell = row[n]
                    .append("td")
                    .append("input")
        .attr("type", "text")
        .attr("id", rawdata.links[n].source+"-->"+rawdata.links[n].target)
        .attr("name", rawdata.links[n].source+"-->"+rawdata.links[n].target)
        .attr("value",rawdata.links[n].units)
                    .text()

            }
        
        valueKeys = Object.entries(rawdata).slice(0,4)
        
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

    formatLookup = {"inUnits": ",", "unitSales": "$,", "copqGoal": ".3%", "cogqGoal": ".3%"}
    for (n in valueKeys){
        fmt = d3.format(formatLookup[valueKeys[n][0]])

    row[n] = valueTable.append("tr")
    nameCell = row[n]
        .append("td")
        .text(valueKeys[n][0])
    valueCell = row[n]
        .append("td")
        .append("input")
        .attr("type", "text")
        .attr("id", valueKeys[n][0])
        .attr("name", valueKeys[n][0])
        .attr("value",fmt(valueKeys[n][1]))
        
        
    
    }
        


    })


    }
    
    function submitData() {
        d3.json("example-data.json", function (err, data) {
        

        rawdata = data.data
        console.log(rawdata)

        valueTabInputs = d3.select("#valueTable").selectAll("input").nodes()
        for (node of valueTabInputs)
        {
            if (node.value.includes("%"))
                {rawdata[node.name]=node.value.replace("%","")/100}
            else {rawdata[node.name]=node.value.replace("$","").replace(",","")}
        }

        probTabInputs = d3.select("#inputTable").selectAll("input").nodes()
        for (node of probTabInputs)
        {nSource = node.name.split("-->")[0]
        nTarget = node.name.split("-->")[1]
        
        nLink = rawdata.links.find(d=>d.source === nSource && d.target===nTarget)
        // console.log(node.name)
        // console.log(nLink)
        nLink.units = node.value}

        
        // // console.log(d3.select("#valueTable").selectAll("input").nodes())
        // console.log(d3.select("#valueTable").selectAll("input").nodes()[0].name)
        // // d3.select("#valueTable").selectAll("input").node().name
        // console.log(d3.select("#valueTable").selectAll("input").nodes()[0].value)
        dataToDraw = rawdata
        drawUnits(dataToDraw)
        
    })
    }
