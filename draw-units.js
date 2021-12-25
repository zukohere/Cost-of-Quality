
// var form = d3.select("body").append("form");
        
// var p = form.selectAll("p")
//     .data(data.nodes)
//     .enter()
//     .append("p")
//     .each(function(d){
//         var self = d3.select(this);
//         var label = self.append("label")
//             .text(d.name)
//             .style("width", "100px")
//             .style("display", "inline-block");

        
//             var input = self.append("input")
//                 .attr({
//                     type: function(d){ return "text"; },
//                     name: function(d){ return d.name; }
//                 });
        
//       })
//         form.append("button")
//         .attr('type', 'submit')
//         .attr("id", "run")
//         .text('Save & Run');
//       d3.select("#run").on("click",runEnter)










// function runEnter() {
// Prevent the page from refreshing
// d3.event.preventDefault();
////clear svg
//d3.selectAll("svg > *").remove();

data = data2


////////////////////////////////// Begin Remove Rounding Error from particles ///////////////////////
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

const inUnits = 50

for (level of [...new Set(Array.from(data.links, d => d.level))]) {
  links = data.links.filter(d => d.level === level)
  for (link of links) {
    prevLinks = data.links.filter(d => d.target === link.source)
    if (level === 0) { link.unitCount = inUnits }
    else {

      link.unitCount = Math.floor(link.units / 100 * d3.sum(Array.from(prevLinks, d => d.unitCount)))
      // console.log(d3.sum(data.links.filter(d=>d.target===link.source).map(d=>d.unitCount)))
      if (link === links[links.length - 1])
        while (d3.sum(data.links.filter(d => d.source === link.source).map(d => d.unitCount)) <
          d3.sum(data.links.filter(d => d.target === link.source).map(d => d.unitCount))) {
          var ind =  getRandomIntInclusive(0, links.length - 1)
          links[ind].unitCount = links[ind].unitCount + 1 * (Math.random() * 100 < link.units)
        console.log(data.links.filter(d => d.source === link.source))
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
pieUnits = [{ "node": nodeArray[0], "terminal": false, "units": inUnits, "unitCost": inUnits*data.nodes.find(d=>d.name===nodeArray[0]).cost, "sColor": data.nodes.find(d=>d.name===nodeArray[0]).COQ, "sGorP": data.nodes.find(d=>d.name===nodeArray[0]).GorP}]
for (nodeEx of nodeArray.slice(1)) {
  var terminal = targetArray.includes(nodeEx) && !sourceArray.includes(nodeEx)

  // sColor = sankeyNodes.filter(b => b.name === nodeEx)[0].x0
  sColor = data.nodes.find(d=>d.name===nodeEx).COQ
  sGorP = data.nodes.find(d=>d.name===nodeEx).GorP
  sUnits = nodeUnits[nodeEx]
  sunitCost = data.nodes.find(d=>d.name===nodeEx).cost * sUnits
  pieUnits.push({ "node": nodeEx, "terminal": terminal, "units": sUnits, "unitCost": sunitCost, "sColor": sColor, "sGorP": sGorP })
}
console.log("pieUnits")
console.log(pieUnits)
// drawPie(pieUnits)
data = data2
///// End set up pie chart


//// Begin Unit Count Bar Chart ////////////
var targetUnits = [{ "node": nodeArray[0], "terminal": false, "units": inUnits, "unitCost": inUnits*data.nodes.find(d=>d.name===nodeArray[0]).cost, "sColor": data.nodes.find(d=>d.name===nodeArray[0]).COQ, "sGorP": data.nodes.find(d=>d.name===nodeArray[0]).GorP}]
for (nodeEx of nodeArray.slice(1)) {
  var terminal = targetArray.includes(nodeEx) && !sourceArray.includes(nodeEx)

  sColor = data.nodes.find(d=>d.name===nodeEx).COQ
  sGorP = data.nodes.find(d=>d.name===nodeEx).GorP
  targetUnits.push({ "node": nodeEx, "terminal": terminal, "units": 0, "unitCost": 0, "sColor": sColor, "sGorP": sGorP })
}

var svg = d3.select("#barcharts"),
  margin = { top: 20, right: 20, bottom: 250, left: 100 },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// set the domains of the axes
x.domain(targetUnits.map(function (d) { return d.node; }));
y.domain([0, d3.max(targetUnits.map(d=>d.unitCost))]);
// y.domain([0, inUnits]);



// add the svg elements
g.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-65)");

g.append("g")
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y).ticks(10))
  .append("text")
  .attr("class", "y-axis-title")
  .attr("transform", "rotate(-90)")
  .attr("x",-height/2)
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
    return d.unitCost;
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


var t = d3.timer(tick, 1000);
var particles = [];
var totalUnits = []
levels = [...new Set(Array.from(data.links, d => d.level))]
// console.log(levels)
level = -1

function tick(elapsed, time) {
  if (particles.filter(d => d.current < d.length).length === 0) {

    if (particles.length > 0) {
      totalUnits = totalUnits.concat(particles)
      updateCharts()
      updateIndicator(targetUnits)
      updateCOQ(targetUnits)
    }
    level = level + 1
    
    particles = []
  }
  

  d3.selectAll("#path-" + (level))
    .each(
      function (d, i) {
        var offset = (Math.random() - .5) * (d.dy - 4)
        var length = this.getTotalLength();
        particles.push({ link: d, time: elapsed, offset: offset, path: this, length: length, animateTime: length, speed: 0.5 + (Math.random()) })
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
  for (var x in particles) {
    var currentTime = elapsed - particles[x].time;
    particles[x].current = currentTime * 0.15 * particles[x].speed;
  
    var currentPos = particles[x].path.getPointAtLength(particles[x].current);
    context.beginPath();
    if (particles[x].link.optimal === "no") {context.fillStyle= "red"} else {context.fillStyle= "green"}
    context.arc(currentPos.x, currentPos.y + particles[x].offset, particles[x].link.particleSize, 0, 2 * Math.PI);
    context.fill();
  }
}

/////////////////////// updates Unit Bar Chart
function updateCharts() {
  
  for (nodeEx of Array.from(data.nodes, d => d.name).slice(1)) {
    
    lookupTarget = targetUnits.find(p => p.node == nodeEx)
    lookupTarget.units = totalUnits.filter(d => d.link.target.name === nodeEx).length
    lookupTarget.unitCost = totalUnits.filter(d => d.link.target.name === nodeEx).length*data.nodes.find(d=>d.name===nodeEx).cost
    
  }
  
    console.log("Total exiting system: " + d3.sum(targetUnits.filter(d => d.terminal === true).map(d => d.units)))
    // if (d3.sum(targetUnits.filter(d => d.terminal === true).map(d => d.units))===inUnits) {
      // pieUnits = targetUnits
    // drawPie()
  // }
  // update the bars
  y.domain([0, d3.max(targetUnits.map(d=>d.unitCost))]);
  d3.selectAll(".axis").filter(".axis--y")
  .data(targetUnits)
  .transition().duration(1000)
  .call(d3.axisLeft(y).ticks(10))
  

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
      return d.unitCost;
    })
    .attr("x", function (d) {
      return x(d.node) + x.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return y(d.unitCost) - 5;
    })
  
}
