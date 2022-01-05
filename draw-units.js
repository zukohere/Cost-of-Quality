
function drawUnits(data) {
  // data = data2
  // var margin = { top: 150, right: 100, bottom: 130, left: 120 };
  var margin = { top: 0, right: 100, bottom: 50, left: 0 };
  var width = 1000;
  var height = 300;

  // threshold before the sankey model stops representing unit for unit and caps.
  modelUnitLimit = 500

  //  using probabilistic or known value?
  knownVal = d3.select("#modelType").node().value === "probVal"
  // set inUnits (number of units input)
  const inUnits = data.inUnits

  const nodePadding = 40;

  const circularLinkGap = 2;


  var sankey = d3.sankey()
    .nodeWidth(10)
    .nodePadding(nodePadding)
    .nodePaddingRatio(0.9)
    .scale(0.5)
    .size([width, height])
    .nodeId(function (d) {
      return d.name;
    })
    .nodeAlign(d3.sankeyCenter)
    // .nodeAlign(d3.sankeyLeft)
    // .nodeAlign(d3.sankeyRight)
    // .nodeAlign(d3.sankeyJustify)
    .iterations(1);
  

  // var svg = d3.select("#chart").append("svg")


  var svg = d3.select("#sankey").select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var linkG = g.append("g")
    .attr("class", "links")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.2)
    .selectAll("path");

  var nodeG = g.append("g")
    .attr("class", "nodes")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g");

  //run the Sankey + circular over the data
  let sankeyData = sankey(data);
  let sankeyNodes = sankeyData.nodes;
  let sankeyLinks = sankeyData.links;

  let depthExtent = d3.extent(sankeyNodes, function (d) { return d.depth; });


  //Adjust link Y coordinates based on target/source Y positions

  var node = nodeG.data(sankeyNodes)
    .enter()
    .append("g");
  

  var node_tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([75, 0])
    .html(function (d) { return d.name + "<br>" + "$" + (d.cost) + "/unit"; });
    svg.call(node_tool_tip);

  node.append("rect")
    .attr("x", function (d) { return d.x0; })
    .attr("y", function (d) { return d.y0; })
    .attr("height", function (d) { return d.y1 - d.y0; })
    .attr("width", function (d) { return d.x1 - d.x0; })
    .style("fill", function (d) { return (colorLookup[d.COQ]); })
    .style("opacity", 0.5)
    .on("mouseover",  function (d) {
      console.log(d)
      node_tool_tip.offset([-d.height,0]).show(d)

      let thisName = d.name;

      node.selectAll("rect")
        .style("opacity", function (d) {
          return highlightNodes(d, thisName)
        })

      d3.selectAll(".sankey-link")
        .style("opacity", function (l) {
          return l.source.name == thisName || l.target.name == thisName ? 1 : 0.3;
        })

      node.selectAll("text")
        .style("opacity", function (d) {
          return highlightNodes(d, thisName)
        })
    })
    .on("mouseout", function (d) {
      node_tool_tip.hide(d)
      node.selectAll("rect").style("opacity", 0.5);
      d3.selectAll(".sankey-link").style("opacity", 0.7);
      node.selectAll("text").style("opacity", 1);
    })

  node.append("text")
    .attr("x", function (d) { return (d.x0 + d.x1) / 2; })
    .attr("y", function (d) { return d.y0 - 12; })
    .attr("dy", "0.35em")
    .attr("text-anchor", "start")
    .text(function (d) { return d.name; });
  


  var link = linkG.data(sankeyLinks)
    .enter()
    .append("g")

  link.append("path")
    .attr("class", "sankey-link")
    .attr("d", sankeyPath)
    .style("stroke-width", function (d) { return Math.max(1, d.width); })
    .style("opacity", 0.7)
    .style("stroke", function (link, i) {
      if (link.optimal === "yes") { return "black" } else { return "red" }
    })
    .attr("id", function (d) { return "path-" + d.level })

  link.append("title")
    .text(function (d) {
      return d.source.name + " → " + d.target.name + "\n Index: " + (d.index);
    });

    var chartTitle = data.chartTitle
    var tipText = data.tipText
    var tool_tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([75, 0])
                .html(data.tipText);
            svg.call(tool_tip);

            svg.append("g")
                .append("text")
                .attr("x", (width + margin.left + margin.right) / 2)
                .attr("y", (height + margin.top + margin.bottom)/6)
                .attr("class", "sankeyTitle")
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .text(chartTitle)
                .on('mouseover', tool_tip.show)
                .on('mouseout', tool_tip.hide);

  //ARROWS
  // var arrowsG = linkG.data(sankeyLinks)
  //   .enter()
  //   .append("g")
  //   .attr("class", "g-arrow")
  //   .call(appendArrows, 10, 10, 4) //arrow length, gap, arrow head size

  // arrowsG.selectAll("path")
  //   .style("stroke-width", "10")
  //   //.style("stroke-dasharray", "10,10")

  //   arrowsG.selectAll(".arrow-head").remove()

  // let duration = 5
  // let maxOffset = 10;
  // let percentageOffset = 1;

  //     //https://stackoverflow.com/questions/35556876/javascript-repeat-a-function-x-amount-of-times
  //     function runFunctionXTimes(callback, interval, repeatTimes) {
  //     let repeated = 0;
  //     const intervalTask = setInterval(doTask, interval)

  //     function doTask() {
  //         if ( repeated < repeatTimes ) {
  //             callback()
  //             repeated += 1
  //         } else {
  //             clearInterval(intervalTask)
  //         }
  //     }
  // } 
  //

  // var animateDash = setInterval(updateDash, duration);
  // runFunctionXTimes(updateDash,duration,5)


  // function updateDash() {

  //   arrowsG.selectAll("path")
  //   .style("stroke-dashoffset", percentageOffset * maxOffset)

  //   percentageOffset = percentageOffset == 0 ? 1 : percentageOffset - 0.01
  //   // percentageOffset = percentageOffset == 0.5 
  // }

  function highlightNodes(node, name) {

    let opacity = 0.3

    if (node.name == name) {
      opacity = 1;
    }
    node.sourceLinks.forEach(function (link) {
      if (link.target.name == name) {
        opacity = 1;
      };
    })
    node.targetLinks.forEach(function (link) {
      if (link.source.name == name) {
        opacity = 1;
      };
    })

    return opacity;

  }

  //////// SET UP PARTICLE THROUGHTPUT BY LEVEL (groupings of links) to be passed to Pie Chart
  nodeArray = Array.from(data.nodes, d => d.name)
  sourceArray = [...new Set(Array.from(data.links, d => d.source.name))]
  targetArray = [...new Set(Array.from(data.links, d => d.target.name))]
  

  nodeUnits = {}
  for (nodeEx of targetArray) {
    unitsIn = d3.sum(data.links.filter(d => d.target.name === nodeEx).map(d => d.unitCount))
    unitsOut = d3.sum(data.links.filter(d => d.source.name === nodeEx).map(d => d.unitCount))
    probSum = d3.sum(data.links.filter(d => d.source.name === nodeEx).map(d => d.units))
    console.log("node:" + nodeEx + " probSum: " + probSum + " units in:" + unitsIn + " units out:" + unitsOut)
    nodeUnits[nodeEx] = unitsIn
    var terminal = targetArray.includes(nodeEx) && !sourceArray.includes(nodeEx)
    if (!terminal && unitsIn != unitsOut) {confText = "Warning: For "+nodeEx +", the units entering ("+unitsIn+") and exiting ("+unitsOut+
        ") do not match. Press OK to run anyway."
      alert(confText)}
  }



  //// Set up Pie Chart
  pieUnits = []
  
    for (nodeEx of nodeArray) {
     
      nodelevel = data.links.filter(d => d.source.name === nodeEx).map(p=>p.level)
      var terminal = targetArray.includes(nodeEx) && !sourceArray.includes(nodeEx)
      var sColor = data.nodes.find(d => d.name === nodeEx).COQ
      var sGorP = data.nodes.find(d => d.name === nodeEx).GorP
      if (nodelevel.includes(0)) {
        pieUnits.push({"node": nodeEx, "terminal": terminal, "unitCount": inUnits,"unitCost": inUnits * data.nodes.find(d => d.name === nodeEx).cost, "sColor": data.nodes.find(d => d.name === nodeEx).COQ, "sGorP": data.nodes.find(d => d.name === nodeEx).GorP })
      
      }
      else {

        sUnits = nodeUnits[nodeEx]
        sunitCost = data.nodes.find(d => d.name === nodeEx).cost * sUnits
        pieUnits.push({ "node": nodeEx, "terminal": terminal,"unitCount": sUnits, "unitCost": sunitCost, "sColor": sColor, "sGorP": sGorP })
      }
    }
  
  ///// End set up pie chart

  //// Pass pie data to Indicators and draw.
  drawIndicators(pieUnits, data)

  //// Begin Unit Count Bar Chart ////////////
    // targetUnits is used for bar charts, is pieUnits but resets all but the initial unit count/cost.
    // Will get updated by the Sankey model particles below.

    // deep copy of pieUnits per https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/ 
    var targetUnits = JSON.parse(JSON.stringify(pieUnits))
    for (nodeEx of nodeArray) {
      nodelevel = data.links.filter(d => d.source.name === nodeEx).map(p=>p.level)
      if (!nodelevel.includes(0)) {
        targetUnits.find(d=>d.node === nodeEx).unitCount = 0
        targetUnits.find(d=>d.node === nodeEx).unitCost = 0
      }}


  var svg = d3.select("#barcharts"),
    margin = { top: 70, right: 20, bottom: 250, left: 100 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // set the domains of the axes
  x.domain(targetUnits.map(function (d) { return d.node; }));
  y.domain([0, d3.max(targetUnits.map(d => d.unitCost))]);
  



  // add the svg elements
  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)")
    .append("tspan")
    .text(" ■")
    .style("fill", d => colorLookup[pieUnits.find(p => p.node === d).sGorP])
    ;

  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10).tickFormat(d3.format("$.2s")))
    .append("text")
    .attr("class", "y-axis-title")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -65)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("fill", "black")
    .text("(Cost in $)");

 

  g.selectAll(".bar")
    .data(targetUnits)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return x(d.node); })
    .attr("y", function (d) { return y(d.unitCost); })
    .attr("width", x.bandwidth())
    .attr("height", function (d) { return height - y(d.unitCost); })
    .style("fill", function (d) { return colorLookup[d.sColor] })
    .style("opacity", 0.5);


  g.selectAll(".text")
    .data(targetUnits)
    .enter()
    .append("text")
    .attr("class", "label")
    .text(function (d) {
      return d3.format("$.2s")(d.unitCost);
    })
    .attr("x", function (d) {
      return x(d.node) + x.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return y(d.unitCost) - 5;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

  var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([160, 0])
    .html("This bar chart displays the cost of each operation"+
    "<br> based on the number of units passing through it."+
    // "<br><br><strong> Hover over any bar to see more information.</strong>"+
    "<br><br> If the number of units is less than "+modelUnitLimit+", "+
    "<br> the bar chart will update right along with the flow chart!"+
    "<br> Otherwise, the full chart displays right away, and the flow displays"+
    "<br> a representative quantity.");
  svg.call(tool_tip);

  // title with hover text
  g.append("g")
    .append("text")
    .attr("x", (width / 2 - 40))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Costs per Process Step")
    .on('mouseover', tool_tip.show)
    .on('mouseout', tool_tip.hide);

  // subtitle COPQ, COGQ
  g.selectAll(".subtitle")
    .data(["COPQ", "COGQ"])
    .enter()
    .append("text")
    .text(function (d) {return d})
    .attr("x", function(d,i) {return (width / 2 - 70)+60*(i)})
    .attr("y", 0 - (margin.top / 2)+20)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .append("tspan")
    .text(" ■")
    .style("fill", function(d) {return colorLookup[d]})
  

  ///////////////////////////// End Unit Bar Chart
  drawPie(pieUnits)


  //////////// Additional Sankey/Particle Setup ///////////////////
  sankey.link = function () {
    var curvature = .5;

    nodes = []

    link.curvature = function (_) {
      if (!arguments.length) return curvature;
      curvature = +_;
      return link;
    };

    nodes = sankeyData.nodes
    size = [1, 1]


    nodes.forEach(function (node) {
      node.value = Math.max(
        d3.sum(node.sourceLinks, d => d.value),
        d3.sum(node.targetLinks, d => d.value)
      )
    })
    
    var nodesByBreadth = d3.nest()
      .key(function (d) { return d.x; })
      .sortKeys(d3.ascending)
      .entries(nodes)
      .map(function (d) { return d.values; });

    var ky = d3.min(nodesByBreadth, function (nodes) {
      return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, d => d.value);
    });

    nodesByBreadth.forEach(function (nodes) {
      nodes.forEach(function (node, i) {
        node.y = i;
        node.dy = node.value * ky;
      });
    });
    links = sankeyData.links
    links.forEach(function (link) {
      link.dy = link.value * ky;
    });


    return link;
  };


  var path = sankey.link()

  var linkExtent = d3.extent(data.links, function (d) { return d.value });

  var frequencyScale = d3.scaleLinear().domain([0, 1]).range([0.05, 1]);
  var particleSize = d3.scaleLinear().domain(linkExtent).range([1, 5]);


  data.links.forEach(function (link) {
    link.freq = frequencyScale(link.value);
    link.particleSize = 2;

  })

if (inUnits < 1001) {
  let t = d3.interval(elapsed => {
    tick(elapsed);
    if (d3.select("#killData").node().value === "stoptime") { t.stop() }
  });


}

else {
    targetUnits = pieUnits
    updateCharts()
    updateIndicator(pieUnits,data)
  let t = d3.interval(elapsed => {
    tick1000plus(elapsed);
    if (d3.select("#killData").node().value === "stoptime") { t.stop() }
  });

}

var particles = [];
var totalUnits = []
levels = [...new Set(Array.from(data.links, d => d.level))]

level = -1

//////////////////////////// For if units < modelUnitLimit
  function tick(elapsed, time) {

    
    if (particles.filter(d => d.current < d.length).length === 0) {

      if (particles.length > 0) {
        totalUnits = totalUnits.concat(particles)
        updateCharts()
        updateIndicator(targetUnits, data)

      }
      level = level + 1

      particles = []
    }

    //Set speed scale
    speedScale = d3.scaleLinear().domain([0, inUnits]).range([.5,1.5])

    d3.selectAll("#path-" + (level))
      .each(
        function (d, i) {
          var offset = (Math.random() - .5) * (d.dy - 4)
          var length = this.getTotalLength();
          particles.push({ link: d, time: elapsed, offset: offset, path: this, length: length, animateTime: length, speed: speedScale(d.unitCount) + speedScale(Math.random())  })
        });

    testParticles = []
    for (particleLink of d3.selectAll("#path-" + level).data()) {
      
      testParticles = testParticles.concat(particles.filter(d => d.link === particleLink).slice(0, particleLink.unitCount))
    }
    particles = testParticles
    
    particleEdgeCanvasPath(elapsed)

  }

  //////////////////////////// For if units are < modelUnitLimit
  function tick1000plus(elapsed, time) {
    
    if (particles.filter(d => d.current < d.length).length === 0) {

     level = level + 1

      particles = []
    }
    

    // unit scale down to modelUnitLimit
    unitScale = d3.scaleLinear().domain([0,inUnits]).range([0,modelUnitLimit])

    d3.selectAll("#path-" + (level))
      .each(
        function (d, i) {
          var offset = (Math.random() - .5) * (d.dy - 4)
          var length = this.getTotalLength();
          particles.push({ link: d, time: elapsed, offset: offset, path: this, length: length, animateTime: length, speed: 0.5 + (Math.random()) })
        });
        

    testParticles = []
    for (particleLink of d3.selectAll("#path-" + level).data()) {
      
      testParticles = testParticles.concat(particles.filter(d => d.link === particleLink).slice(0, unitScale(particleLink.unitCount)))
    }
    
    particles = testParticles
   
    particleEdgeCanvasPath(elapsed)

  }
  function particleEdgeCanvasPath(elapsed) {

    var context = d3.select("canvas").node().getContext("2d")

    context.clearRect(0, 0, d3.selectAll("canvas").node().width, d3.selectAll("canvas").node().height);

    context.fillStyle = "gray";
    context.lineWidth = "1px";
    for (ind in particles) {
      var currentTime = elapsed - particles[ind].time;
      particles[ind].current = currentTime *0.15 * particles[ind].speed;

      var currentPos = particles[ind].path.getPointAtLength(particles[ind].current);
      context.beginPath();
      if (particles[ind].link.optimal === "no") { context.fillStyle = "red" } else { context.fillStyle = "green" }
      context.arc(currentPos.x, currentPos.y + particles[ind].offset, particles[ind].link.particleSize, 0, 2 * Math.PI);
      context.fill();
    }
  }

  /////////////////////// updates Unit Bar Chart
  function updateCharts() {
    if (inUnits<modelUnitLimit) {
    for (nodeEx of Array.from(data.nodes, d => d.name).slice(1)) {

      lookupTarget = targetUnits.find(p => p.node == nodeEx)
      lookupTarget.unitCount = totalUnits.filter(d => d.link.target.name === nodeEx).length
      lookupTarget.unitCost = totalUnits.filter(d => d.link.target.name === nodeEx).length * data.nodes.find(d => d.name === nodeEx).cost

    }
  }
    
    console.log("Total exiting system: " + d3.sum(targetUnits.filter(d => d.terminal === true).map(d => d.unitCount)))
  
    // update the bars
    y.domain([0, d3.max(targetUnits.map(d => d.unitCost))]);
    d3.selectAll(".axis").filter(".axis--y")
      .data(targetUnits)
      .transition().duration(1000)
      .call(d3.axisLeft(y).ticks(10).tickFormat(d3.format("$.2s")))
    // 

    g.selectAll(".bar")
      .data(targetUnits)
      .transition().duration(1000)
      .attr("class", "bar")
      .attr("x", function (d) { return x(d.node); })
      .attr("y", function (d) { return y(d.unitCost); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - y(d.unitCost) });

    g.selectAll(".label")
      .data(targetUnits)
      .transition().duration(1000)
      .text(function (d) {
        return d3.format("$.2s")(d.unitCost);
      })
      .attr("x", function (d) {
        return x(d.node) + x.bandwidth() / 2;
      })
      .attr("y", function (d) {
        return y(d.unitCost) - 5;
      })

  }

}
