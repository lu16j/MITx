var data = [4, 77, 8, 32, 40, 8, 15];

var outerWidth = 300;
var outerHeight = 300;

var margin = {top: 20,
              right: 20,
              bottom: 20,
              left: 20};

var chartWidth = outerWidth - margin.left - margin.right;
var chartHeight = outerHeight - margin.top - margin.bottom;

var yscale = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([chartHeight, 0]);
var xscale = d3.scale.ordinal()
    .domain(d3.keys(data))
    .rangeBands([0, chartWidth]);

var chart = d3.select(".chart-container")
    .append("svg")
        .attr("class", "chart")
        .attr("height", outerHeight)
        .attr("width", outerWidth)
    .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.selectAll("line").data(yscale.ticks(10)).enter()
    .append("line")
        .attr("x1", 0)
        .attr("y1", yscale)
        .attr("x2", chartWidth)
        .attr("y2", yscale);

chart.selectAll(".yscale-label").data(yscale.ticks(10)).enter()
    .append("text").attr("class", "yscale-label")
        .attr("x", 0)
        .attr("y", yscale)
        .attr("dx", -margin.left/8)
        .attr("dy", "0.3em")
        .attr("text-anchor", "end")
        .text(String);

chart.selectAll("rect").data(data).enter()
    .append("rect")
        .attr("x", function (d, i) { return xscale(i); })
        .attr('y', yscale)
        .attr("width", xscale.rangeBand())
        .attr("height", function (d) { return chartHeight - yscale(d); });

chart.selectAll(".bar-label").data(data).enter()
    .append("text").attr("class", "bar-label")
        .attr("y", function (d) { return yscale(d) + margin.top / 4; })
        .attr("x", function (d, i) { return xscale(i) + xscale.rangeBand() / 2; })
        .attr("dy", "0.7em")
        .attr("text-anchor", "middle")
        .text(String);