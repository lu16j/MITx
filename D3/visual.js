var data = [4, 77, 8, 32, 0, 40, 8, 15];

var chartWidth = 300;
var chartHeight = 300;

var yscale = d3.scale.linear().domain([0, d3.max(data)]).range([0, chartHeight]);
var xscale = d3.scale.ordinal().domain(d3.keys(data)).rangeBands([0, chartWidth]);

var chart = d3.select(".chart-container").append("svg").attr("class", "chart").attr("height", chartHeight).attr("width", chartWidth);

chart.selectAll("rect").data(data).enter().append("rect").attr("x", function (d, i) { return xscale(i); }).attr('y', function (d) { return chartHeight - yscale(d); }).attr("width", xscale.rangeBand()).attr("height", yscale);

chart.selectAll("text").data(data).enter().append("text").attr("y", function (d) { return chartHeight - yscale(d) + 5; }).attr("x", function (d, i) { return xscale(i) + xscale.rangeBand()/2; }).attr("dy", "0.7em").attr("text-anchor", "middle").text(function (d) { return d; });