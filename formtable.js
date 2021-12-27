function formTable() {
    // get the original data
    let data = data2
    // set up the table
    var table = d3.select("#inputTable").append("table").attr("border", 1);

    //create header row
    var header = table.append("thead").append("tr");
    header
        .selectAll("th")
        .data(["Source Node", "Link Probability", "Value"])
        .enter()
        .append("th")
        .text(d => { return d })

        row = []
        sourceArray = [...new Set(Array.from(data.links, d => d.source))]
        // ind = data.links.length length not needed since doing i in which uses index.
        
       
            for (n in data.links){
            sourceLinks = data.links.filter(d => d.source === data.links[n].source)
            // Always add a row
            row[n] = table.append("tr")
                    // if it's the first time the source is coming up, append the td for the source.
                    if (data.links[n]===sourceLinks[0]){
                    sourceCell = row[n]
                        .append("td")
                        .text(data.links[n].source)
                        .attr("rowspan", sourceLinks.length)
                }
                // otherwise go straight to appending the td's for target and value 
                targetCell = row[n]
                    .append("td")
                    .text(data.links[n].target)
                valueCell = row[n]
                    .append("td")
                    .text(data.links[n].units)

            }
        

        // {
        // row[i]= table.append("tr")
        // if (i===0){    
        // sourceCell = row[i]
        // .append("td")
        // .text("source")
        // .attr("rowspan",2) }  
        // targetCell = row[i]
        // .append("td")
        // .text("target")
        // valueCell = row[i]
        // .append("td")
        // .text("value")


        // }






        //     var tablebody = table.append("tbody");
        // rows = tablebody
        //     .selectAll("tr")
        //     .data(data.links)
        //     .enter()
        //     .append("tr")
        // sourceCells = tablebody.selectAll("tr")
        //     .append("td")
        //     .text(function(d,i) { return d.source})
        //     // d.source,
        //     // .attr("rowspan",d=>data.links.filter(p=>p.source===d.source).length)
        // targetCells = tablebody.selectAll("tr")
        //     .append("td")
        //     .text(d=>"Prob("+d.source+"-->"+d.target+")")

        // valueCells = tablebody.selectAll("tr")
        // .append("td")
        // .text(d=>d.units+"%")



        // //  sourceArray = [...new Set(Array.from(data.links, d => d.source.name))]
        // //  for (source in sourceArray)
        // //  {table.append("tr")}
    return data
    }

    function submitData() {
        data = data2
        return data
    }

    console.log(submitData())