d3.json("static/data/data.json", function (dataset) {
    for (level of Object.keys(dataset)) {

        drawChart(level)
    }

})

function drawChart(level) {
    // Data
    d3.json("static/data/data.json", function (dataset) {
        var dataset = dataset[level]
        // Accessors
        console.log("hello")
        console.log(dataset[0])
        const sexAccessor = d => d.sex
        const sexes = [...new Set(Array.from(dataset, d => d.sex))]
        const sexIds = d3.range(sexes.length)

        const educationAccessor = d => d.education
        let educationNames = [...new Set([].concat.apply([], Array.from(dataset, d => Object.keys(d.endpoint))))]
        console.log(educationNames)
        const educationIds = d3.range(educationNames.length)
        console.log(educationIds)
        const sesAccessor = d => d.ses
        let sesNames = [...new Set(Array.from(dataset, d => d.ses))]
        console.log(sesNames)

        const sesIds = d3.range(sesNames.length)

        // probabilities
        const stackedProbabilities = {}
        dataset.forEach(startingPoint => {
            const key = getStatusKey(startingPoint)
            let stackedProbability = 0
            stackedProbabilities[key] = educationNames.map((education, i) => {
                stackedProbability += (startingPoint.endpoint[education] / 100)
                if (i == educationNames.length - 1) {
                    // account for rounding
                    return 1
                } else {
                    return stackedProbability
                }
            })
        })

        // persons
        let currentPersonId = 0
        function generatePerson(elapsed) {
            currentPersonId++
            const sex = getRandomValue(sexIds)
            const ses = getRandomValue(sesIds)
            const statusKey = getStatusKey({
                sex: sexes[sex],
                ses: sesNames[ses],
            })

            const probabilities = stackedProbabilities[statusKey]
            // console.log("female--Horn")
            const education = d3.bisect(probabilities, Math.random())

            return {
                id: currentPersonId,
                sex,
                ses,
                education,
                startTime: elapsed + getRandomNumberInRange(-0.1, 0.1),
                yJitter: getRandomNumberInRange(-15, 15)

            }
        }

        // dimensions
        let dimensions = {
            //width: d3.min([width, 1200]),
            width: 1200,
            height: 800,
            margin: {
                top: 10,
                right: 280,
                bottom: 10,
                left: 280,
            },
            pathHeight: 50,
            endsBarsWidth: 15,
            endingBarPadding: 3,
        }
        dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
        dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

        // canvas
        const wrapper = d3.select("#container").append("wrapper")
            .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)

        const bounds = wrapper.append("g")
            .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

        // scales
        const xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, dimensions.boundedWidth])
            .clamp(true)

        const startYScale = d3.scaleLinear()
            .domain([sesIds.length, -1])
            .range([0, dimensions.boundedHeight])
        const endYScale = d3.scaleLinear()
            .domain([educationIds.length, -1])
            .range([0, dimensions.boundedHeight])

        const linkLineGenerator = d3.line()
            .x((d, i) => i * (dimensions.boundedWidth / 5))
            .y((d, i) => i <= 2
                ? startYScale(d[0])
                : endYScale(d[1])
            )
            .curve(d3.curveMonotoneX)

        const yTransitionProgressScale = d3.scaleLinear()
            .domain([0.45, 0.55])
            .range([0, 1])
            .clamp(true)

        const colorScale = d3.scaleLinear()
            .domain(d3.extent(sexIds))
            .range(["#12CBC4", "#B53471"])
            .interpolate(d3.interpolateHcl)

        // draw data
        const linkOptions = d3.merge(
            sesIds.map(startId => (
                educationIds.map(endId => (
                    new Array(6).fill([startId, endId])
                ))
            ))
        )
        const linksGroup = bounds.append("g")
        const links = linksGroup.selectAll(".category-path")
            .data(linkOptions)
            .enter().append("path")
            .attr("class", "category-path")
            .attr("d", linkLineGenerator)
            .attr("stroke-width", dimensions.pathHeight)

        //labels
        const startingLabelsGroup = bounds.append("g")
            .style("transform", "translateX(-20px)")
            
                

        const startingLabels = startingLabelsGroup.selectAll(".start-label")
            .data(sesIds)
            .enter().append("text")
            .attr("class", "label start-label")
            // .attr("y", (d, i) => startYScale(i))
            .text((d, i) => sentenceCase(sesNames[i]))
            .attr("transform", function (d, i) {return "translate(0,"+
            (startYScale(i)-15).toString()+") rotate(-90)"})
            
        const startLabel = startingLabelsGroup
        //    const startLabel = d3.select("startbar"+d3.max(sesIds))
           .append("text")
           .attr("class", "start-title")
            .text("Origin")
            .attr("transform", "translate(30,"+
            (startYScale(sesIds[sesIds.length - 1]) - 65).toString()+") rotate(-90)")
            
            
        const startLabelLineTwo = startingLabelsGroup.append("text")
            .attr("class", "start-title")
            .attr("y", startYScale(sesIds[sesIds.length - 1]) - 50)
            .text("Region")
        const startingBars = startingLabelsGroup.selectAll(".start-bar")
            .data(sesIds)
            .enter().append("rect")
            .attr("id",function(d){return "startbar"+d})
            .attr("x", 20)
            .attr("y", d => startYScale(d) - (dimensions.pathHeight / 2))
            .attr("width", dimensions.endsBarsWidth)
            .attr("height", dimensions.pathHeight)
            .attr("fill", colorScale)

        const endingLabelsGroup = bounds.append("g")
            .style("transform", `translateX(${dimensions.boundedWidth + 20}px)`)

        const endingLabels = endingLabelsGroup.selectAll(".end-label")
            .data(educationNames)
            .enter().append("text")
            .attr("class", "label end-label")
            // .attr("y", (d, i) => endYScale(i) - 15)
            .text(d => d)
            .attr("transform", function (d, i) {return "translate(-10,"+
            (endYScale(i)+30).toString()+") rotate(-90)"})

        const legendGroup = bounds.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${dimensions.boundedWidth}, 0)`)

        const femaleLegend = legendGroup.append("g")
            .attr("transform", `translate(${-dimensions.endsBarsWidth * 1.5 + dimensions.endingBarPadding + 1}, 0)`)

        var triangle = d3.symbol()
            .type(d3.symbolTriangle)
            .size(50)

        femaleLegend.append("path")
            .attr("d", triangle)
            .attr("transform", "translate(-7, 2) rotate(-90)")
            

        femaleLegend.append("text")
            .attr("class", "legend-text-left")
            .text("Defective")
            .attr("x", 70)
            .attr("y", -7)
            .attr("transform", "rotate(-90)")

        femaleLegend.append("line")
            .attr("class", "legend-line")
            .attr("x1", -dimensions.endsBarsWidth / 2 + 19)
            .attr("x2", -dimensions.endsBarsWidth / 2 + 19)
            .attr("y1", 12)
            .attr("y2", 37)

        const maleLegend = legendGroup.append("g")
            .attr("transform", `translate(${-dimensions.endsBarsWidth / 2 - 4}, 0)`)

        maleLegend.append("circle")
            .attr("r", 5.5)
            .attr("transform", "translate(5, 0)")

        maleLegend.append("text")
            .attr("class", "legend-text-right")
            .text("Good Quality")
            .attr("x", 15)
            .attr("y", 4)
            .attr("transform", "rotate(-90)")

        maleLegend.append("line")
            .attr("class", "legend-line")
            .attr("x1", -dimensions.endsBarsWidth / 2 - 6)
            .attr("x2", -dimensions.endsBarsWidth / 2 - 6)
            .attr("y1", 12)
            .attr("y2", 37)


        // draw data
        const femaleMarkers = endingLabelsGroup.selectAll(".female-marker")
            .data(educationIds)
            .enter().append("circle")
            .attr("class", "ending-marker female-marker")
            .attr("r", 5.5)
            .attr("cx", 5)
            .attr("cy", d => endYScale(d) - 7)

        var triangle = d3.symbol()
            .type(d3.symbolTriangle)
            .size(50)

        const maleMarkers = endingLabelsGroup.selectAll(".male-marker")
            .data(educationIds)
            .enter().append("path")
            .attr("class", "ending-marker male-marker")
            .attr("d", triangle)
            .attr("transform", d => `translate(6.5, ${endYScale(d) + 20}) rotate(-90)`)

        // number of units flowing into system
        const maxPeople = 100
        let people = []
        const markersGroup = bounds.append("g")
            .attr("class", "markers-group")


        const endingBarGroup = bounds.append("g")
            .attr("transform", `translate(${dimensions.boundedWidth}, 0)`)

        function updateMarkers(elapsed) {
            //keep labels from writing on top of each other.
            endingLabelsGroup.selectAll(".ending-value").html("")
            //

            const xProgressAccessor = d => (elapsed - d.startTime) / 5000
            if (people.length < maxPeople) {
                people = [
                    ...people,
                    ...d3.range(2).map(() => generatePerson(elapsed)),
                ]
            }

            const females = markersGroup.selectAll(".marker-circle")
                .data(people.filter(d => (
                    xProgressAccessor(d) < 1
                    && sexAccessor(d) == 0
                )), d => d.id)
            females.enter().append("circle")
                .attr("class", "marker marker-circle")
                .attr("r", 5.5)
                .style("opacity", 0)
            females.exit().remove()

            const males = markersGroup.selectAll(".marker-triangle")
                .data(people.filter(d => (
                    xProgressAccessor(d) < 1
                    && sexAccessor(d) == 1
                )), d => d.id)

            var triangle = d3.symbol()
                .type(d3.symbolTriangle)
                .size(50)
            males.enter().append("path")
                .attr("class", "marker marker-triangle")
                .attr("d", triangle)
                .style("opacity", 0)
            males.exit().remove()

            const markers = d3.selectAll(".marker")
            markers.style("transform", d => {
                const x = xScale(xProgressAccessor(d))
                const yStart = startYScale(sesAccessor(d))
                const yEnd = endYScale(educationAccessor(d))
                const yChange = yEnd - yStart
                const yProgress = yTransitionProgressScale(xProgressAccessor(d))
                const y = yStart + (yChange * yProgress) + d.yJitter
                return `translate(${x}px, ${y}px)`
            })
                .attr("fill", d => colorScale(sexAccessor(d)))
                .transition().duration(100)
                .style("opacity", d => xScale(xProgressAccessor(d)) < 10 ? 0 : 1)

            const endingGroups = educationIds.map((endId, i) => (
                people.filter(d => (
                    xProgressAccessor(d) >= 1
                    && educationAccessor(d) == endId
                ))
            ))

            const endingPercentages = d3.merge(
                endingGroups.map((peopleWithSameEnding, endingId) => (
                    d3.merge(
                        sexIds.map(sexId => (
                            sesIds.map(sesId => {
                                const peopleInBar = peopleWithSameEnding.filter(d => (
                                    sexAccessor(d) == sexId
                                ))
                                const countInBar = peopleInBar.length
                                const peopleInBarWithSameStart = peopleInBar.filter(d => (
                                    sesAccessor(d) == sesId
                                ))
                                const count = peopleInBarWithSameStart.length
                                const numberOfPeopleAbove = peopleInBar.filter(d => (
                                    sesAccessor(d) > sesId
                                )).length
                                return {
                                    endingId,
                                    sesId,
                                    sexId,
                                    count,
                                    countInBar,
                                    percentAbove: numberOfPeopleAbove / (peopleInBar.length || 1),
                                    percent: count / (countInBar || 1),
                                }
                            })
                        ))
                    )
                ))
            )

            endingBarGroup.selectAll(".ending-label")
                .data(endingPercentages)
                .enter()
                .append("rect")
                // .join('rect')
                .attr("class", "ending-bar")
                .attr("x", d => -dimensions.endsBarsWidth * (d.sexId + 1) - (d.sexId * dimensions.endingBarPadding))
                .attr("width", dimensions.endsBarsWidth)
                .attr("y", d => endYScale(d.endingId) - dimensions.pathHeight / 2 + dimensions.pathHeight * d.percentAbove)
                .attr("height", d => d.countInBar ? dimensions.pathHeight * d.percent : dimensions.pathHeight)
                .attr("fill", d => d.countInBar ? colorScale(d.sesId) : "#DADADD")


            endingLabelsGroup.selectAll(".ending-bar")
                .data(endingPercentages)
                .enter()
                .append("text")
                .attr("class", "ending-value")
                // .attr("x", d => (d.sesId) * 33 + 47)
                // .attr("y", d => endYScale(d.endingId) - dimensions.pathHeight / 2 + 14 * d.sexId + 35)
                .attr("fill", d => d.countInBar ? colorScale(d.sesId) : "#DADADD")
                .text(d => `${d.count}     `)
                .attr("transform", d => `translate(${(d.sesId) * 33 + 40},${endYScale(d.endingId) - dimensions.pathHeight / 2 + 30 * d.sexId + 10}) rotate(-90)`)
            
        

        }
        
        d3.timer(updateMarkers)
    }
    )
}

//helper functions
getStatusKey = ({ sex, ses }) => [sex, ses].join("--")
sentenceCase = str => [
    str.slice(0, 1).toUpperCase(),
    str.slice(1),
].join("")

getRandomValue = arr => arr[Math.floor(getRandomNumberInRange(0, arr.length))]

getRandomNumberInRange = (min, max) => Math.random() * (max - min) + min

//reference: https://observablehq.com/@chekos/animated-sankey
