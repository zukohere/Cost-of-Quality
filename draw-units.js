
function drawUnits(data) {
  // data = data2
  // var margin = { top: 150, right: 100, bottom: 130, left: 120 };
  var margin = { top: 0, right: 100, bottom: 50, left: 0 };
  var width = 1000;
  var height = 300;

  //  let data = data2;

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
  // console.log(sankey)

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

  //Uses gradient to create node color
  // var nodeColour = d3.scaleSequential(d3.interpolateCool)
  //  .domain([0,width]);

  //  //Creates color based on COQ components
  //  const colorLookup = {
  //    "COGQ": "DarkSeaGreen",
  //    "COPQ": "LightCoral",
  //    "Prevention": "blue",
  //    "Appraisal": "purple",
  //    "Internal Failure": "orange",
  //    "External Failure": "red",
  //    "Shipping": "gray",
  //    "End User": "green"
  //  }


  //Adjust link Y coordinates based on target/source Y positions

  var node = nodeG.data(sankeyNodes)
    .enter()
    .append("g");
  //  console.log(node)






  node.append("rect")
    .attr("x", function (d) { return d.x0; })
    .attr("y", function (d) { return d.y0; })
    .attr("height", function (d) { return d.y1 - d.y0; })
    .attr("width", function (d) { return d.x1 - d.x0; })
    .style("fill", function (d) { return (colorLookup[d.COQ]); })
    .style("opacity", 0.5)
    .on("mouseover", function (d) {

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

  // adds tooltip on hover over node rectangles.
  node.append("title")
    .text(function (d) { return d.name + "\n" + "$" + (d.cost) + "/unit"; });
  //  console.log(node)

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

  ////////////////////////////////// Begin Remove Rounding Error from particles ///////////////////////
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }

  const inUnits = data.inUnits

  for (level of [...new Set(Array.from(data.links, d => d.level))]) {
    links = data.links.filter(d => d.level === level)
    for (link of links) {
      prevLinks = data.links.filter(d => d.target === link.source)
      if (!link.unitCount) {
        if (level === 0) { link.unitCount = inUnits }
        else {

          link.unitCount = Math.floor(link.units / 100 * d3.sum(Array.from(prevLinks, d => d.unitCount)))
          // console.log(d3.sum(data.links.filter(d=>d.target===link.source).map(d=>d.unitCount)))
          if (link === links[links.length - 1])
            while (d3.sum(data.links.filter(d => d.source === link.source).map(d => d.unitCount)) <
              d3.sum(data.links.filter(d => d.target === link.source).map(d => d.unitCount))) {
              var ind = getRandomIntInclusive(0, links.length - 1)
              links[ind].unitCount = links[ind].unitCount + 1 * (Math.random() * 100 < link.units)
              // console.log(data.links.filter(d => d.source === link.source))
            }
        }

      }
    }
  }
  nodeArray = Array.from(data.nodes, d => d.name)
  sourceArray = [...new Set(Array.from(data.links, d => d.source.name))]
  targetArray = [...new Set(Array.from(data.links, d => d.target.name))]
  // console.log(data.links)

  nodeUnits = {}
  for (nodeEx of targetArray) {
    unitsIn = d3.sum(data.links.filter(d => d.target.name === nodeEx).map(d => d.unitCount))
    unitsOut = d3.sum(data.links.filter(d => d.source.name === nodeEx).map(d => d.unitCount))
    probSum = d3.sum(data.links.filter(d => d.source.name === nodeEx).map(d => d.units))
    console.log("node:" + nodeEx + " probSum: " + probSum + " units in:" + unitsIn + " units out:" + unitsOut)
    nodeUnits[nodeEx] = unitsIn
  }

  ///////////////// End Rounding Error /////////////

  //// Set up Pie Chart
  pieUnits = [{ "node": nodeArray[0], "terminal": false, "units": inUnits, "unitCost": inUnits * data.nodes.find(d => d.name === nodeArray[0]).cost, "sColor": data.nodes.find(d => d.name === nodeArray[0]).COQ, "sGorP": data.nodes.find(d => d.name === nodeArray[0]).GorP }]
  for (nodeEx of nodeArray.slice(1)) {
    var terminal = targetArray.includes(nodeEx) && !sourceArray.includes(nodeEx)

    // sColor = sankeyNodes.filter(b => b.name === nodeEx)[0].x0
    sColor = data.nodes.find(d => d.name === nodeEx).COQ
    sGorP = data.nodes.find(d => d.name === nodeEx).GorP
    sUnits = nodeUnits[nodeEx]
    sunitCost = data.nodes.find(d => d.name === nodeEx).cost * sUnits
    pieUnits.push({ "node": nodeEx, "terminal": terminal, "units": sUnits, "unitCost": sunitCost, "sColor": sColor, "sGorP": sGorP })
  }
  // console.log("pieUnits")
  // console.log(pieUnits)
  // drawPie(pieUnits)
  // data = data2
  ///// End set up pie chart

  //// Pass pie data to Indicators and draw.
  drawIndicators(pieUnits)

  //// Begin Unit Count Bar Chart ////////////
  var targetUnits = [{ "node": nodeArray[0], "terminal": false, "units": inUnits, "unitCost": inUnits * data.nodes.find(d => d.name === nodeArray[0]).cost, "sColor": data.nodes.find(d => d.name === nodeArray[0]).COQ, "sGorP": data.nodes.find(d => d.name === nodeArray[0]).GorP }]
  for (nodeEx of nodeArray.slice(1)) {
    var terminal = targetArray.includes(nodeEx) && !sourceArray.includes(nodeEx)

    sColor = data.nodes.find(d => d.name === nodeEx).COQ
    sGorP = data.nodes.find(d => d.name === nodeEx).GorP
    targetUnits.push({ "node": nodeEx, "terminal": terminal, "units": 0, "unitCost": 0, "sColor": sColor, "sGorP": sGorP })
  }

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
  // y.domain([0, inUnits]);



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

  // var targetUnits = [{ "node": nodeArray[0], "terminal": false, "units": inUnits, "sColor": sankeyNodes.filter(b => b.name === nodeArray[0])[0].x0 }]


  g.selectAll(".bar")
    .data(targetUnits)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return x(d.node); })
    .attr("y", function (d) { return y(d.unitCost); })
    .attr("width", x.bandwidth())
    .attr("height", function (d) { return height - y(d.unitCost); })
    .style("fill", function (d) { return colorLookup[d.sColor] })
    // .style("fill", function (d) { return nodeColour(d.sColor) })
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
    .offset([50, 0])
    .html("I'm a tool tip!");
  svg.call(tool_tip);

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
    // console.log(nodes)
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
    // Makes particles same color as node bars
    // link.particleColor = d3.scaleLinear().domain([0, 1])
    //   .range([link.source.color, link.target.color]);

  })


  let t = d3.interval(elapsed => {
    tick(elapsed);
    if (d3.select("#killData").node().value === "stoptime") { t.stop() }
  });

  var particles = [];
  var totalUnits = []
  levels = [...new Set(Array.from(data.links, d => d.level))]
  // console.log(levels)
  level = -1

  function tick(elapsed, time) {

    // console.log(elapsed)
    if (particles.filter(d => d.current < d.length).length === 0) {

      if (particles.length > 0) {
        totalUnits = totalUnits.concat(particles)
        updateCharts()
        updateIndicator(targetUnits)

      }
      level = level + 1

      particles = []
    }

    //Set speed scale
    speedScale = d3.scaleLinear().domain([0, inUnits]).range([0.5, 1])

    d3.selectAll("#path-" + (level))
      .each(
        function (d, i) {
          var offset = (Math.random() - .5) * (d.dy - 4)
          var length = this.getTotalLength();
          particles.push({ link: d, time: elapsed, offset: offset, path: this, length: length, animateTime: length, speed: speedScale(d.unitCount) + speedScale(Math.random()) })
        });

    testParticles = []
    for (particleLink of d3.selectAll("#path-" + level).data()) {
      testParticles = testParticles.concat(particles.filter(d => d.link === particleLink).slice(0, particleLink.unitCount))
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
      particles[ind].current = currentTime * 0.15 * particles[ind].speed;

      var currentPos = particles[ind].path.getPointAtLength(particles[ind].current);
      context.beginPath();
      if (particles[ind].link.optimal === "no") { context.fillStyle = "red" } else { context.fillStyle = "green" }
      context.arc(currentPos.x, currentPos.y + particles[ind].offset, particles[ind].link.particleSize, 0, 2 * Math.PI);
      context.fill();
    }
  }

  /////////////////////// updates Unit Bar Chart
  function updateCharts() {

    for (nodeEx of Array.from(data.nodes, d => d.name).slice(1)) {

      lookupTarget = targetUnits.find(p => p.node == nodeEx)
      lookupTarget.units = totalUnits.filter(d => d.link.target.name === nodeEx).length
      lookupTarget.unitCost = totalUnits.filter(d => d.link.target.name === nodeEx).length * data.nodes.find(d => d.name === nodeEx).cost

    }

    console.log("Total exiting system: " + d3.sum(targetUnits.filter(d => d.terminal === true).map(d => d.units)))
    // if (d3.sum(targetUnits.filter(d => d.terminal === true).map(d => d.units))===inUnits) {
    // pieUnits = targetUnits
    // drawPie()
    // }
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