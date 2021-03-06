// inspired by https://codepen.io/danbrellis/pen/aEMGMp
function drawPie(pieUnits) {
    var defVis = {};

    (function (visualization) {
        visualization.donut = {};

        // console.log(pieUnits)

        var topLevelItem = { label: ["CoQ", "($" + d3.sum(pieUnits.map(d => d.unitCost)).toLocaleString("en-US")+")" ]};

        //   
        /// Design, Mfg, Inspect etc.
        //   var baseCats = [...new Set(Array.from(pieUnits, d => d.node))]

        var coqCats = [...new Set(Array.from(pieUnits, d => d.sColor))]
        var GorPCats = [...new Set(Array.from(pieUnits, d => d.sGorP))]

        coqCatscount = {}
        for (cat of coqCats) { coqCatscount[cat] = 0 }
        var pieGrandchild = []
        for (units of pieUnits) {
            totalCost = units.unitCost
            sGorP = units.sGorP
            var grandChildcolor = d3.color(colorLookup[units.sColor])
            // console.log("orig " + grandChildcolor)
            grandChildcolor = grandChildcolor.brighter(50 * coqCatscount[units.sColor])
            pieGrandchild.push({ colorIndex: d3.rgb(colorLookup[units.sColor]).darker(0.45 * coqCatscount[units.sColor]), value: totalCost, label: units.node, parentLabel: units.sColor })
            coqCatscount[units.sColor]++
            // console.log("brighter " + grandChildcolor)
        }
        catCostlookup = {}
        for (cat of coqCats) { catCostlookup[cat] = d3.sum(pieGrandchild.filter(d => d.parentLabel === cat).map(d => d.value)) }

        d3.sum(pieGrandchild.map(d => d.value))
        for (d of pieGrandchild) { d.label = [d.label, "($" + d.value.toLocaleString("en-US") + "; " + Math.round(100 * d.value / catCostlookup[d.parentLabel]) + "%)" ]}



        // Prevention, Appraisal, Etc.

        var pieChild = []
        for (cat of coqCats) {
            totalCost = d3.sum(pieUnits.filter(d => d.sColor === cat).map(d => d.unitCost))
            sGorP = pieUnits.filter(d => d.sColor === cat)[0].sGorP
            pieChild.push({ colorIndex: colorLookup[cat], value: totalCost, label: cat, parentLabel: sGorP, childData: pieGrandchild.filter(d => d.parentLabel === cat) })
        }
        gorpCostlookup = {}
        for (GorP of GorPCats) { gorpCostlookup[GorP] = d3.sum(pieChild.filter(d => d.parentLabel === GorP).map(d => d.value)) }

        d3.sum(pieChild.map(d => d.value))
        for (d of pieChild) { d.label = [d.label, "($" + d.value.toLocaleString("en-US") + "; " + Math.round(100 * d.value / gorpCostlookup[d.parentLabel]) + "%)" ]}


        // Cost of Good/Poor Quality

        var pieData = []
        for (GorP of GorPCats) {
            totalCost = d3.sum(pieUnits.filter(d => d.sGorP === GorP).map(d => d.unitCost))
            pieData.push({ colorIndex: colorLookup[GorP], value: totalCost, label: GorP, childData: pieChild.filter(d => d.parentLabel === GorP) })
        }
        gorpCost = d3.sum(pieData.map(d => d.value))
        for (d of pieData) { d.label = [d.label, "($" + d.value.toLocaleString("en-US") + "; " + Math.round(100 * d.value / gorpCost) + "%)"] }
        // console.log(pieData)

        //   var data = [
        //     {colorIndex: 0, value: 43, childData: subData, label: "Nitrogen"},
        //     {colorIndex: 1, value: 31, childData: subData, label: "Phosphorous"},
        //     {colorIndex: 2, value: 16, childData: subData, label: "Sediment"}
        //   ];

        var dataOriginal = pieData.slice(0);

        var selectedPath = [],
            selectedPathColors = [];

        function endall(transition, callback) {
            var n = 0;
            transition
                .each(function () {
                    ++n;
                })
                .on("end", function () {
                    if (!--n) callback.apply(this, arguments);
                });
        }

        //Global Variables
        var svg = d3.select("#graph-container")
        var width = +svg.attr("width"),
            height = +svg.attr("height")
            margin = 100,
        radius = 100;




        var transformAttrValue = function (adjustLeft) {
            var leftValue = margin + radius;
            if (adjustLeft) {
                leftValue += adjustLeft;
            }
            return "translate(" + leftValue + "," + (margin + radius) + ")";
        };

        //   var colors = d3.scaleOrdinal(d3["schemeCategory20b"]);

        var chart, pieSVG, chartLabelsGroup, chartCenterLabelGroup, chartCenterLabel,
            arc, arcSmall, pie, path, chartSelect, arcOver;

        function zoomIn(d) {

            if (!d.data.childData) {
                //No children to zoom in to
                return false;
            }

            var sel = d3.select(this);

            //Search the current path to see the counter where it was selected. (Also update selected path)
            for (var i = 0; i < path._groups[0].length; i++) {
                if (path._groups[0][i] == sel._groups[0][0]) {
                    selectedPath.push(i);
                    selectedPathColors.push(d.data.colorIndex);
                    break;
                }
            }

            //remove hover effect and return selected arc to 'normal' size
            sel.attr("d", arc);

            //create 'parent' outer arc
            var startAngle = d.startAngle,
                endAngle = d.endAngle;

            var arcSelect = d3.arc()
                .startAngle(function (s) {
                    return startAngle;
                })
                .endAngle(function (s) {
                    return endAngle;
                })
                .innerRadius(function (i) {
                    return radius - 20;
                })
                .outerRadius(function (o) {
                    return radius * 1.1
                });

            var newArc = chartSelect.append("path")
                .style("fill", d.data.colorIndex)
                .attr('d', arcSelect)
                .on("click", zoomOut(d));

            newArc.transition()
                .duration(1000)
                .attrTween("d", function () {
                    var newAngle = d.startAngle + 2 * Math.PI;
                    var interpolate = d3.interpolate(d.endAngle, newAngle);
                    return function (tick) {
                        endAngle = interpolate(tick);
                        return arcSelect(d);
                    };
                })
                .on("end", zoomInSweepEnded(d.data.childData));
        }

        function zoomOut(clickedItem, selectedItem) {
            return function () {
                //Determine the current path item while zooming.
                var currentItem = getCurrentItemData(1); //sibling data for selected item (aka new data to show for building primary paths)
                selectedPath.pop();
                selectedPathColors.pop();

                selectedItem = selectedItem || d3.select(this);
                selectedItem.on("click", null);

                if (selectedPath.length > 0) {
                    //in .secondary add a new path that will zoom in to form the new outer
                    //gets it's data from the last element in selectedPath
                    var parentItem = getCurrentItem();

                    var arcSelect = d3.arc()
                        .startAngle(function (s) {
                            return 0;
                        })
                        .endAngle(function (s) {
                            return 2 * Math.PI;
                        })
                        .innerRadius(function (i) {
                            return radius * 2;//radius;
                        })
                        .outerRadius(function (o) {
                            return (radius * 1.1) + (((radius*2)-(radius-40 ) ) / 1.75);
            //  // curOuterRadius = origOuterRadius + ((curInnerRadius - origInnerRadius) / 1.75)
            
                        });

                    var newOuterParentData = pie(getCurrentItemData(1));

                    var newOuter = chartSelect.append("path")
                        .style("fill", parentItem.colorIndex)
                        .attr('d', arcSelect)
                        .attr('class', 'zoom-out')
                        .style("transform", "scale(1.25)")
                        .style('opacity', 0)
                        .on("click", zoomOut(newOuterParentData[selectedPath[selectedPath.length - 1]]));

                    newOuter
                        .transition()
                        .delay(350)
                        .ease(d3.easeCubicOut)
                        .duration(750)
                        .style('opacity', 1)
                        .style('transform', 'scale(1)')
                        .on('end', function () {
                            newOuter.style("transform", null);
                        })
                }

                //takes old outer and resizes to zoom around and form it's proper place in new primary
                zoomZeArc(selectedItem, true, function () {
                    //resize what was the outer parent to match it's data
                    var startAngle = clickedItem.startAngle;
                    var endAngle = clickedItem.startAngle + 2 * Math.PI;

                    var arcSelect = d3.arc()
                        .startAngle(function (s) {
                            return startAngle;
                        })
                        .endAngle(function (s) {
                            return endAngle;
                        })
                        .innerRadius(function (i) {
                            return radius - 20;
                        })
                        .outerRadius(function (o) {
                            return radius * 1.1;
                        });

                    var arcFinal = d3.arc()
                        .startAngle(function (s) {
                            return startAngle;
                        })
                        .endAngle(function (s) {
                            return endAngle;
                        })
                        .outerRadius(radius)
                        .innerRadius(radius - 20);

                    selectedItem.transition()
                        .duration(750)
                        .attrTween("d", function () {
                            var newAngle = clickedItem.startAngle + 2 * Math.PI;
                            var interpolate = d3.interpolate(newAngle, clickedItem.endAngle);
                            return function (tick) {
                                endAngle = interpolate(tick);
                                return arcSelect(clickedItem);
                            }
                        })
                        .on("end", function () {
                            selectedItem.transition()
                                .ease(d3.easeBounceIn)
                                .duration(500)
                                .attr("d", arcFinal)
                                .on("end", function () {
                                    selectedItem.remove();
                                });
                        })
                });

                path
                    .transition()
                    .ease(d3.easeBackInOut)
                    .duration(750)
                    .attr("transform", "scale(.5), rotate(-90)")
                    .style('opacity', 0)
                    .call(endall, function () {
                        path
                            .attr("transform", "scale(1), rotate(0)")
                            .style("opacity", 1);
                        path = drawPrimaryPaths(currentItem)
                            .on('click', zoomIn);

                        updatePieLabels();
                    });
            }
        }

        function zoomInSweepEnded(childData) {
            return function () {

                var selectedItem = d3.select(this);
                var path = drawPrimaryPaths(childData);
                path.attr("transform", "scale(0.5), rotate(-90)")
                    .style("opacity", 0);

                updatePieLabels();

                path
                    .transition()
                    .ease(d3.easeBackInOut)
                    .duration(750)
                    .attr("transform", "scale(1), rotate(0)")
                    .style("opacity", 1)
                    .call(function () {

                    });

                //take any existing parent and zooms it out of existence
                d3.selectAll(".secondary .zoom-out")
                    .transition()
                    .ease(d3.easeBackInOut)
                    .duration(750)
                    .attr('transform', "scale(1.25)")
                    .style("opacity", 0)
                    .remove()
                    .call(function () {

                    });

                //takes selected item that just finished sweeping around and expands it out
                zoomZeArc(selectedItem, false);
            }
        }

        function drawPrimaryPaths(data) {
            var pathUpdate = chart.selectAll("path")
                .data(pie(data));

            var pathEnter = pathUpdate.enter().append("path");

            pathUpdate.exit().remove();

            var pathEnterUpdate = pathEnter.merge(pathUpdate);

            pathEnterUpdate
                .style("fill", function (d) {
                    return d.data.colorIndex;
                })
                .attr('d', arc)
                .each(function (d) {
                    this._current = d;
                })
                //   .on("mouseover", function () {
                //   //return false;
                //   d3.select(this).transition()
                //     .duration(100)
                //     .ease(d3.easeQuadOut)
                //     .attr("d", arcOver);
                // }).on("mouseout", function () {
                //   //return false;
                //   d3.select(this).transition()
                //     .duration(500)
                //     .ease(d3.easeBounceOut)
                //     .attr("d", arc);
                // })
                .on("click", zoomIn);
            path = pathEnterUpdate;
            return pathEnterUpdate;
        }

        function zoomZeArc(selectedItem, reverse, callback) {
            //set sizing for outer arc
            var zoomScale = 2,
                origOuterRadius = radius * 1.1,
                origInnerRadius = radius - 40;
                

            var finalInnerRadius = radius * zoomScale;

            var curInnerRadius = origInnerRadius,
                curOuterRadius = origOuterRadius;
            
            var arcZoom = d3.arc()
                .startAngle(0)
                .endAngle(2 * Math.PI)
                .outerRadius(function () {
                    return (curOuterRadius);
                })
                .innerRadius(function () {
                    return (curInnerRadius);
                });
            
            //zooming in, so add 'zoom-out' class
            if (!reverse) {
                selectedItem.attr("class", "zoom-out");
            }

            selectedItem
                .transition()
                .ease(d3.easeBackInOut)
                .duration(750)
                .attrTween("d", function () {
                    var iInner = reverse ? d3.interpolate(finalInnerRadius, origInnerRadius) : d3.interpolate(origInnerRadius, finalInnerRadius);
                    
                    return function (tick) {
                        // console.log("hi")
                        curInnerRadius = iInner(tick);
                        curOuterRadius = origOuterRadius + ((curInnerRadius - origInnerRadius) / 1.75);
                        return arcZoom(selectedItem);
                    }
                })
                .on("end", function () {
                    if (callback) {
                        callback();
                    }
                });
                
        }

        function updatePieLabels() {

            chartCenterLabelCat.text(getCurrentItem().label[0]);
            chartCenterLabelVal.text(getCurrentItem().label[1]);

            chartLabelsGroup.html("");

            var sliceLabels = chartLabelsGroup.selectAll("text").data(pie(path.data()));
            var currentData = getCurrentItemData();

            sliceLabels
                .enter()
                .append("text")
                .style("opacity", 0)
                .transition().duration(750)
                .style("opacity", 0.75)
                .style("background-color", "black")
                .attr("class", "outer-label")
                // .attr("text-anchor", "end")
                .attr('transform', function (d) {
                    return "translate(" + arcSmall.centroid(d) + ")"
                })
                .attr("dy", "0em")
                .text(function (d, i) {
                    return currentData[i].label[0];
                })
                sliceLabels
                .enter()
                .append("text")
                .style("opacity", 0)
                .transition().duration(750)
                .style("opacity", 0.75)
                .style("background-color", "black")
                .attr("class", "outer-label")
                // .attr("text-anchor", "end")
                .attr('transform', function (d) {
                    return "translate(" + arcSmall.centroid(d) + ")"
                })
                .attr("dy", "1em")
                .text(function (d, i) {
                    return currentData[i].label[1];
                })
        
                }

        function getCurrentItem() {
            if (selectedPath.length === 0) {
                return topLevelItem;
            }
            var currentItem = donutdata;
            for (var i = 0; i < selectedPath.length; i++) {
                if (i + 1 < selectedPath.length) {
                    currentItem = currentItem[selectedPath[i]].childData;
                }
                else currentItem = currentItem[selectedPath[i]];
            }
            return currentItem;
        }

        function getCurrentItemAsBreadCrumbs() {
            if (selectedPath.length == 0) {
                return [topLevelItem.label];
            }
            var currentItem = data;
            var returnList = [topLevelItem.label];
            for (var i = 0; i < selectedPath.length; i++) {
                returnList.push(currentItem[selectedPath[i]].label);
                if (i + 1 < selectedPath.length) {
                    currentItem = currentItem[selectedPath[i]].childData;
                } else {
                    currentItem = currentItem[selectedPath[i]];
                }
            }
            return returnList;
        }

        function getCurrentItemData(minusIndex) {
            minusIndex = minusIndex | 0;
            var currentItem = donutdata;

            for (var i = 0; i < selectedPath.length - minusIndex; i++) {
                currentItem = currentItem[selectedPath[i]].childData
            }
            return currentItem;
        }

        function getRandomNumberInRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        visualization.donut.getBreadCrumbs = function () {
            return getCurrentItemAsBreadCrumbs();
        };

        visualization.donut.randomize = function () {

            //Set some random dataz and animate it

            var currentDataLevel = getCurrentItemData();
            for (var i = 0; i < currentDataLevel.length; i++) {
                currentDataLevel[i].value = currentDataLevel[i].value * getRandomNumberInRange(75, 125) / 100.0;
            }

            path.data(pie(currentDataLevel))

            path.transition().duration(750).attrTween("d", function (a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function (t) {
                    return arc(i(t));
                };
            });

        };

        visualization.donut.show = function () {
            var svgContainer = d3.select("#graph-container");
            svgContainer.html("");
            donutdata = dataOriginal.slice(0);
            selectedPath = [];
            selectedPathColors = [];

            //Primary Chart

            pieSVG = svgContainer
                .append("svg")
                .attr("id", "svg-container")
                .attr("width", width)
                .attr("height", height);

            chart = pieSVG
                .append("g")
                .attr("class", "primary")
                .attr('transform', transformAttrValue())
                .style("opacity",0.75);

            chartLabelsGroup = pieSVG
                .append("g")
                .attr("class", "labelGroup")
                .attr("transform", transformAttrValue(-35));

            chartCenterLabelGroup = pieSVG
                .append("g")
                .attr("class", "labelCenterGroup")
                .attr("transform", transformAttrValue())
                .style("text-transform", "uppercase");

            chartCenterLabelCat = chartCenterLabelGroup
                .append("text")
                .attr('dy', '.35em')
                .attr('class', 'chartLabel center')
                .attr('text-anchor', 'middle');
            chartCenterLabelVal = chartCenterLabelGroup
                .append("text")
                .attr('dy', '1.5em')
                .attr('class', 'chartLabel center')
                .attr('text-anchor', 'middle');

            arc = d3.arc()
                .outerRadius(radius)
                .innerRadius(radius - 20);

            arcSmall = d3.arc()
            .outerRadius(radius)
                .innerRadius(radius+60);

            // Arc Interaction Sizing
            arcOver = d3.arc()
                .outerRadius(radius * 1.1)
                .innerRadius(radius - 20);

            pie = d3.pie()
                .value(function (d) {
                    return d.value;
                })
                .sort(null);


            path = drawPrimaryPaths(donutdata);

            updatePieLabels();

            chartSelect = pieSVG.append('g')
                .attr('class', 'secondary')
                .attr("transform", transformAttrValue())
                .style("opacity", 0.5);


            var tool_tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([140, 0])
                .html("This donut chart displays the overall Cost of Quality (COQ)."
                +"<br><br><strong>Click any arc to drilldown into that category and view the component costs as % of COQ."+
                "<br> Click the wide ring to back out to the previous level.</strong>"+
                "<br><br>Level 1: Cost of Poor Quality (COPQ) and Cost of Good Quality (COGQ). "+
                "<br>Level 2: COPQ or COGQ Components. "+
                "<br>Level 3: Operation. ");
            svg.call(tool_tip);

            pieSVG.append("g")
                .append("text")
                .attr("x", (width / 2))
                .attr("y", (margin/ 2.75))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .text("COQ Drilldown")
                .on('mouseover', tool_tip.show)
                .on('mouseout', tool_tip.hide);
        };

        return visualization;
    }(defVis));

    //console.log(defVis.donut.getBreadCrumbs());
    defVis.donut.show();

}