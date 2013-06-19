//outer canvas dimensions
var outerWidth = 300;
var outerHeight = 300;
//margins for inner canvas
var margin = {top: 20,
              right: 20,
              bottom: 20,
              left: 20};
//inner canvas dimensions
var chartWidth = outerWidth - margin.left - margin.right;
var chartHeight = outerHeight - margin.top - margin.bottom;
//stack the different data arrays
var stack = d3.layout.stack();
var stackedData = stack(data);
//compute max heights
var yStackedMax = d3.max(stackedData, function (layer) { return d3.max(layer, function (d) { return d.y + d.y0; }); });
var yGroupedMax = d3.max(stackedData, function (layer) { return d3.max(layer, function (d) { return d.y; }); });
//set the scales
var yscale = d3.scale.linear()
    .domain([0, yStackedMax])
    .range([chartHeight, 0]);
var xscale = d3.scale.ordinal()
    .domain(d3.range(data[0].length))
    .rangeBands([0, chartWidth]);
var colorScale = d3.scale.linear()
    .domain(d3.range(stackedData.length))
    .range([50,205]);
//creates the chart SVG
var chart = d3.select(".chart-container")
    .append("svg").attr("class", "chart")
        .attr("height", outerHeight)
        .attr("width", outerWidth)
    .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//creates the grid lines
var gridLines = chart.selectAll("line").data(yscale.ticks(10)).enter()
    .append("line")
        .attr("x1", 0)
        .attr("y1", yscale)
        .attr("x2", chartWidth)
        .attr("y2", yscale);
//creates the grid labels
var gridLabels = chart.selectAll(".yscale-label").data(yscale.ticks(10)).enter()
    .append("text").attr("class", "yscale-label")
        .attr("x", 0)
        .attr("y", yscale)
        .attr("dx", -margin.left/8)
        .attr("dy", "0.3em")
        .attr("text-anchor", "end")
        .text(String);
//create 'g' group elements for data
var layerGroups = chart.selectAll(".layer").data(stackedData).enter()
    .append("g").attr("class", "layer");
//create stacked bars
var rects = layerGroups.selectAll("rect").data(function (d) { return d; }).enter()
    .append("rect")
        .attr("x", function (d, i) { return xscale(i); })
        .attr("y", function (d) { return yscale(d.y + d.y0); })
        .attr("width", xscale.rangeBand())
        .attr("height", function (d) { return yscale(d.y0) - yscale(d.y + d.y0); })
        .attr("fill", function (d, i, j) { return "rgb(" + Math.round(colorScale(j) / 3 * 2) + "," + Math.round(colorScale(j) / 3) + "," + colorScale(j) + ")"; });
//transform stacked to grouped
function goGrouped() {
    yscale.domain([0, yGroupedMax]);
    rects.transition()
        .duration(1000)
        .delay(function (d, i) { return i * 20; })
        .attr("x", function (d, i, j) { return xscale(i) + xscale.rangeBand() / stackedData.length * j; })
        .attr("width", xscale.rangeBand() / stackedData.length)
    .transition()
        .attr("y", function (d) { return yscale(d.y); })
        .attr("height", function (d) { return chartHeight - yscale(d.y); });
    gridLines.data(yscale.ticks(10)).transition()
        .duration(1000)
        .delay(function (d, i) { return i * 20; })
        .attr("y1", yscale)
        .attr("y2", yscale);
    gridLabels.data(yscale.ticks(10)).transition()
        .duration(1000)
        .delay(function (d, i) { return i * 20; })
        .attr("y", yscale)
        .text(String);
}

//PIEEEEEEEEEEEEEEEEEEEEEEEEE

var pieChart = d3.select(".pie-container")
    .append("svg").attr("class", "pie")
        .attr("height", outerHeight)
        .attr("width", outerWidth);

var testArc = d3.svg.arc()
    .innerRadius(50)
    .outerRadius(100);

//pieChart.append("path")
//    .attr("d", testArc)
//    .attr("transform", "translate(150,150)");

var pieMax = d3.max(data[3], function (d) { return d.y; });

var pieColorScale = d3.scale.linear()
    .domain([0,pieMax])
    .range([50,205]);

var pieData = d3.layout.pie().sort(null)
    .value(function(d) { return d.y; });

var g = pieChart.selectAll(".arc").data(pieData(data[3])).enter()
    .append("g")
        .attr("class", "arc");

g.append("path")
    .attr("d", testArc)
    .attr("transform", "translate(150,150)")
    .attr("fill", function (d) { return "rgb(" + Math.round(pieColorScale(d.value) / 3 * 2) + "," + Math.round(pieColorScale(d.value) / 3) + "," + Math.round(pieColorScale(d.value)) + ")"; });
        

//chart.selectAll("rect").data(data).enter()
//    .append("rect")
//        .attr("x", function (d, i) { return xscale(i); })
//        .attr('y', yscale)
//        .attr("width", xscale.rangeBand())
//        .attr("height", function (d) { return chartHeight - yscale(d); });

//chart.selectAll(".bar-label").data(data).enter()
//    .append("text").attr("class", "bar-label")
//        .attr("y", function (d) { return yscale(d) + margin.top / 4; })
//        .attr("x", function (d, i) { return xscale(i) + xscale.rangeBand() / 2; })
//        .attr("dy", "0.7em")
//        .attr("text-anchor", "middle")
//        .text(String);