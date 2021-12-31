# Cost-of-Quality
Sankey Flow to Visualize Cost of Quality 
https://zukohere.github.io/Cost-of-Quality/

# Requirements
While the Dashboard does run on mobile devices, it is best viewed on the phone. There are tooltips linked to the titles of each visualization that guide the user on how to use them.

## Motivation
I have over 10 years of experience in  Quality Management (at the time this is written). I have seen organizations develop different kinds of quality metrics, and many consider Cost of Quality to be one to manage by. However, attempts to make the metric transparent or develop dashboards are often difficult. Aside from data source and data gathering concerns, the metric is not well understood when it sits in a report among dozens of other measures as simply "COPQ as % of Net Sales". Questions like "What exactly are we measuring?" and "How does this help me direct improvement?" and "What do we do about this?" are natural with any metric, but this one always seemed especially elusive. 

In settings where drilldown is difficult, the metric loses its ability to target improvements. And Quality professionals may find themselves splitting their time between reporting this metric, and driving by other ones, such as open/late CAPAs, Material Inspection Queues, Open Quality Engineering Tasks. 

This project represents the first step at making the metric more transparent for professionals looking to have data drive their Quality Systems as they develop them. The first step is decomposing the Cost of Quality Metric for educational purposes, and that's what I hope this dashboard does.

## Cost of Quality Definition
Quality costs traditionally come from four areas. The are equipment, process, personnel, environmental, management, systems, and material costs to:
* PREVENT defects through controls, training, etc. (Think Preventive Action or QMS Design and Implementation)
* identify or APPRAISE defects (by inspectors, auditors, etc.)
* isolate, remedy or dispose of INTERNAL FAILURES where the product hasn't left the organization's control.
* isolate, remedy, dispose, replace, and rectify EXTERNAL FAILURES where the product has left the organization's control (and is in the hands of a customer, client, distributor, etc.)

The first two represent the Cost of Good Quality (COGQ) and the latter represent the Cost of Poor Quality (COPQ).

It is important that these activities be measurable from the bottom up if an organization wants to manage by COQ, COGQ and/or COPQ to enable cost components to be decomposed into the activities that contribute. As with any quality operations, some coding of reason/operation/cause etc. is helpful to localize the contributing cost. When building data capturing systems, like ERPs, it is important to keep this in mind. 

Thinking like this helps integrate the QMS into typical business processes and keeps Quality staff from chasing ghost data.

## The Dashboard
This project simulates units coming from their source (PFR: Development/Purchasing Controls; In-house manufacture: Product Development/Manufacture), to help better illustrate the relationship between COQ and daily operations.

The dashboard includes 5 visualizations:
1. A modified Sankey model (https://en.wikipedia.org/wiki/Sankey_diagram) of the units flow through the network of processes (nodes and links). For unit counts <500 the model and dashboard will update in real time. For units counts >500 a representative mapping of 500 units will be depicted in the flow chart (for time), but the rest of the dashboard will be accurate to the actual input quantity. Defective units and Poor Quality pathways are in red.
2. A simple 2-stacked bullet chart of defective units exiting the system.   
3. A 3-stacked bullet chart of COPQ, COGQ, and overall COQ. An upper threshold is often set by organizatons. (What's a metric without a goal?) ASQ (https://asq.org/quality-resources/cost-of-quality) reports that COQ can be as much as 15-20% of Net Sales Revenue. But recall COGQ includes the vast makeup of the operational controls that produce the units and get them to customers. This value can be scaled down as needed by narrowing context. When an organization sets goals, as with any metric, it should consider history, capacity, capability, and context.
4. A bar chart of costs by each operation in the flow chart.
5. A donut (pie) chart of component costs to COQ with drilldown functionality. Click any arc to see components. Click the resulting ring to back out to the previous level. This chart will populate immediately and is not live-updated with the flow chart.

Cost, goal, input types, and model types can be edited by the user. The two input types are Probability or known value.

* Probability refers to the chance any operation (say inspection) sends a unit to any of the branched operations (say rework, scrap or to shipping). This enables the dashboard to SIMULATE scenarios.
* Known values refers to the situation where the user might know exactly how many units went from operation to operation. This enables to the dashbaord to model the specific scenario.

## The input Data
Data to set up the process network is "easily" modified, but at this time the user does not have this capability outright. It is possibly to represent wildly complex process networks with this method, and I love a good challenge. The data is a JSON object with values, a node array to identify operations, and a link array to determine flow from one operation to the next. 

## Potential Future Improvements:
* Pareto Charts for COPQ reasons to demonstrate the usefulness of reasons/causes in targeting improvements. (ex. Why was the unit scrapped? Why did it need rework?) 
* Improve Path Complexity to more accurately reflect the network of processes at an organization.
* Include Administrative Hours in the model.
* Include CAPA.

Please feel free to share your ideas for improvements with me! 


## References
 * The general structure of the Sankey is modified from https://bl.ocks.org/tomshanley/874923fe54b173735b456479423ac7d6
 * The units "particles" added to the model were modified from https://observablehq.com/@benjamesdavis/elijah-meeks-particle-sankey
 * The bullet charts are plotly https://plotly.com/javascript/indicator/
 * The pie chart is modified from https://codepen.io/danbrellis/pen/aEMGMp
 * The bar chart is modified from the d3 gallery https://www.d3-graph-gallery.com/graph/barplot_animation_start.html
 * d3 tooltips from http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
 * Cost of Quality concept references include ASQ (https://asq.org/quality-resources/cost-of-quality) and Quality America (https://qualityamerica.com/LSS-Knowledge-Center/qualitymanagement/cost_of_quality_overview.php)