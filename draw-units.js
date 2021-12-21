data = data2

const inUnits = 10
for (level of [...new Set(Array.from(data.links, d => d.level))]) {
  // console.log(level)
  for (link of data.links.filter(d => d.level === level)) {
    if (level === 0) { link.unitCount = inUnits }
    else {
      prevLinks = data.links.filter(d => d.target === link.source)
      link.unitCount = Math.ceil(link.units / 100 * d3.sum(Array.from(prevLinks, d => d.unitCount)))
    }
    // console.log(link)
  }
}

nodeArray = Array.from(data.nodes, d => d.name)
// var canvas = d3.select("canvas")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       // .append("g")
//       // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var svg = d3.select("#barcharts"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// set the domains of the axes
x.domain(data.nodes.map(function(d) { return d.name; }));
y.domain([0, inUnits]);

// add the svg elements
g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10))
  // .append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 6)
  //   .attr("dy", "0.71em")
  //   .attr("text-anchor", "end")
  //   .text("Frequency");

  //   // create the bars
  var targetUnits = [{"node": nodeArray[0], "units": inUnits, "sColor": sankeyNodes.filter(b=>b.name===nodeArray[0])[0].x0}] 
  for (node of nodeArray.slice(1)) {
    var nodes = nodeG.data(sankeyNodes).enter().data()
    console.log(nodes)
    sColor = nodes.filter(b=>b.name===node)[0].x0
    targetUnits.push({"node": node, "units": 0, "sColor": sColor})
   }
  console.log(targetUnits)
  console.log("---------------")
  g.selectAll(".bar")
    .data(targetUnits)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.node); })
      .attr("y", function(d) { return y(d.units); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.units); })
      // .style("fill", function (d) { return nodeColour(sankeyNodes.filter(b=>b.name===d.node)[0].x0); });
      .style("fill", function (d) {return nodeColour(d.sColor)})
      .style("opacity", 0.5);
      // .style("fill", function (d) { console.log(sankeyNodes.filter(b=>b.name===d.node)[0]); });
// console.log(data.links.filter(d => d.level == 0))

sankey.link = function () {
  var curvature = .5;

  nodes = []



  // function link(d) {
  // var SourceID = data.nodes.find(node=>node.name===d.source)
  // var TargetID = data.nodes.find(node=>node.name===d.target)
  // console.log(d.source)
  // var mappedSource = SourceID.index
  // var mappedTarget = TargetID.index
  // console.log(mappedSource)

  // var x0 = d.source.x + d.source.dx,
  //     x1 = d.target.x,
  //     xi = d3.interpolateNumber(x0, x1),
  //     x2 = xi(curvature),
  //     x3 = xi(1 - curvature),
  //     y0 = d.source.y + d.sy + d.dy / 2,
  //     y1 = d.target.y + d.ty + d.dy / 2;
  //   var x0 = d.source.x0,
  //     x1 = d.target.x1,
  //     xi = d3.interpolateNumber(x0, x1),
  //     x2 = xi(curvature),
  //     x3 = xi(1 - curvature),
  //     y0 = d.source.y0,
  //     y1 = d.target.y1;
  // return "M" + x0 + "," + y0
  //      + "C" + x2 + "," + y0
  //      + " " + x3 + "," + y1
  //      + " " + x1 + "," + y1;
  // }

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

// sankeyData=sankeyData
// var path = sankeyData.links
// var link = svg.append("g").selectAll(".link")
// var link = d3.select("svg").append("g").selectAll(".link")
// .data(data.links)
// .enter().append("path")
// .attr("class", "link")
// .attr("d", path)
// .style("stroke-width", function(d) { return Math.max(1, d.dy); })
// .sort(function(a, b) { return b.dy - a.dy; });

var linkExtent = d3.extent(data.links, function (d) { return d.value });
// console.log(linkExtent)
var frequencyScale = d3.scaleLinear().domain([0, 1]).range([0.05, 1]);
var particleSize = d3.scaleLinear().domain(linkExtent).range([1, 5]);


data.links.forEach(function (link) {
  link.freq = frequencyScale(link.value);
  link.particleSize = 2;
  link.particleColor = d3.scaleLinear().domain([0, 1])
    .range([link.source.color, link.target.color]);
  // link.particleColor="black"

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
    }
    level = level + 1
    // console.log(particles[0])
    // if (particles.filter(d=>d.link.circular===true)>0) {

    //   d3.selectAll(".sankey-link").each(function (d) {
    // d.id= "path-"+d.id.split("-")[1] +(level -1) })
    particles = []
  }
  // console.log(particles.filter(d=>d.current < d.length).length===0)
  // particles = particles.filter(function (d) {return d.current < d.path.getTotalLength()});
  // console.log(level)
  // console.log("hi")
  // console.log(d3.selectAll("#path" + 0).getTotalLength())
  // while (level < d3.max(levels)+1){

  // console.log(particles.filter(function (d) {return d.current === d.path.getTotalLength()}))
  //  do {d3.selectAll("#path" + level)
  //  d3.selectAll("#path" + (level))
  // if (d.circular = true) {console.log(this.id.split("-")[1])
  //         d3.selectAll(".sankey-link").attr("id", "path-"+(this.id.split("-")[1]+level-1))
  //       // 
  //     }

  d3.selectAll("#path-" + (level))
    // .data(data.links)
    // .enter()
    .each(
      function (d, i) {



        // console.log("i="+i)
        // console.log(particles.filter(d=>d.current>=this.getTotalLength()))
        // testParticles = particles
        // if (testParticles.filter(d=>d.current<d.length).length === 0) {level = level+1}
        //        if (d.freq < 1) {
        // for (var x = 0;x<1;x++) {
        // console.log(d)
        // var offset = (Math.random() - .5) * (d.dy - 4);
        var offset = (Math.random() - .5) * (d.dy - 4)
        // if (Math.random() < d.freq) {

        var length = this.getTotalLength();
        // console.log(length)
        particles.push({ link: d, time: elapsed, offset: offset, path: this, length: length, animateTime: length, speed: 0.5 + (Math.random()) })
        //   particleLinks = [...new Set(Array.from(particles, d => d.link))]
        //   console.log(particleLinks)
        // linkParticles=[]
        // for (link of particleLinks) {
        // linkParticles.concat(particles.filter(d=>d.link===link).slice(10))
        // console.log(particles.filter(d=>d.link===link).slice(10))  
        // }
        // particles=linkParticles

        // When all particles of given level have current == length, 
        // move on to the next level (and add their costs)



        // }

        // console.log(particles)
        //        }
        /*        else {
                  for (var x = 0; x<d.freq; x++) {
                    var offset = (Math.random() - .5) * d.dy;
                    particles.push({link: d, time: elapsed, offset: offset, path: this})
                  }
                } */
      });

  testParticles = []
  for (particleLink of d3.selectAll("#path-" + level).data()) {
    testParticles = testParticles.concat(particles.filter(d => d.link === particleLink).slice(0, particleLink.unitCount))
    // particles1 = particles.filter(d=>d.link ===d3.selectAll("#path1").data()[0]).slice(0,100)
    // particles = particles0.concat(particles1)
    // console.log(d3.selectAll("#path1").data()[0])
    // console.log(particles[0].link===d3.selectAll("#path1").data()[1])
  }
  particles = testParticles
  
  // console.log("circular = "+ particles[0].link.circular)

  // if (particles.length<1000){
  particleEdgeCanvasPath(elapsed)
  
  // }
  // };
  // console.log(testParticles)
  // if (testParticles.filter(d=>d.current===d.length && d.link.level===level).length===0) {
  //   level = level+1
  // }
  // else {level = level}
  // } while (particles.filter(d=>d.current<d.length).length>0)
  // }while (level<levels.length)
  // }while (testParticles.filter(d=>d.current<d.length && d.link.level===level).length>0)
  // console.log(testParticles.filter(d=>d.current<d.length).length)
  // console.log(level)
  // particles.forEach(d=>console.log(d.link))
  // console.log(totalUnits)
  // if (level <10) {
  //     console.log("level = "+level)
  //      console.log(particles.length)}

}
function particleEdgeCanvasPath(elapsed) {
  // console.log(particles.length)
  // var context = d3.select("canvas").node().getContext("2d")
  var context = d3.select("canvas").node().getContext("2d")
  // console.log(d3.selectAll("canvas").node())
  context.clearRect(0, 0, d3.selectAll("canvas").node().width, d3.selectAll("canvas").node().height);

  context.fillStyle = "gray";
  context.lineWidth = "1px";
  for (var x in particles) {
    // console.log(particles.slice(100))
    var currentTime = elapsed - particles[x].time;
    //        var currentPercent = currentTime / 1000 * particles[x].path.getTotalLength();
    particles[x].current = currentTime * 0.15 * particles[x].speed;
    // particles[x].current = elapsed;

    var currentPos = particles[x].path.getPointAtLength(particles[x].current);
    context.beginPath();
    context.fillStyle = particles[x].link.particleColor(0);
    context.arc(currentPos.x, currentPos.y + particles[x].offset, particles[x].link.particleSize, 0, 2 * Math.PI);
    context.fill();
  }
}

function updateCharts() {
  // var targets = [...new Set(Array.from(totalUnits, d => d.link.target))]
  // var targetNames = targets.map(d=>d.name)
  // var targetUnits = [{"node": nodeArray[0], "units": inUnits}]
  for (node of Array.from(data.nodes, d => d.name).slice(1)) {
    // targetUnits.push({ "node": node, "units": totalUnits.filter(d => d.link.target.name === node).length })
    lookupTarget = targetUnits.find(p=>p.node==node) 
    lookupTarget.units = totalUnits.filter(d => d.link.target.name === node).length 
  console.log(lookupTarget)
  }



  
  // console.log("yscale10 is "+yScale(10))
  // console.log(yScale(10))
  // g.selectAll(".bar")
  //   .data(targetUnits)
  //   .enter().append("rect")
  //     .attr("class", "bar")
  //     .attr("x", function(d) { return x(d.node); })
  //     .attr("y", function(d) { return y(d.units); })
  //     .attr("width", x.bandwidth())
  //     .attr("height", function(d) { return height - y(d.units); });

      // update the bars
  g.selectAll(".bar")
  .data(targetUnits)
      .transition().duration(1000)
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.node); })
    .attr("y", function(d) { return y(d.units); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.units)});

}