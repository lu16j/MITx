var data = [0, 4, 8, 8, 15, 32];

var xscale = d3.scale.linear().domain([0, d3.max(data)]).range(["0%","99%"]);

var chart = d3.select(".chart-container").append("div").attr("class", "chart");

chart.selectAll("div").data(data).enter().append("div").style("width", xscale).text(function(d) {return d;});