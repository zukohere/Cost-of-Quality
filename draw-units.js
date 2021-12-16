data = data2


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
levels = [...new Set(Array.from(data.links, d => d.level))]
  // console.log(levels)
level = -1

function tick(elapsed, time) {
  if (particles.filter(d=>d.current < d.length).length=== 0) {level = level+1, particles = []}
  console.log(particles.filter(d=>d.current < d.length).length===0)
  // particles = particles.filter(function (d) {return d.current < d.path.getTotalLength()});
  
  console.log("hi")
  // console.log(d3.selectAll("#path" + 0).getTotalLength())
  // while (level < d3.max(levels)+1){
    
      // console.log(particles.filter(function (d) {return d.current === d.path.getTotalLength()}))
    //  do {d3.selectAll("#path" + level)
     d3.selectAll("#path" + (level))
      // .data(data.links)
      // .enter()
      .each(
        function (d) {
          
          // console.log(particles.filter(d=>d.current>=this.getTotalLength()))
          testParticles = particles
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
          particles = particles.slice(0, 100)
          
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
  console.log(level)
  console.log(particles)
  // console.log(level)
  
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
