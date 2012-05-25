var mln = [10, 5, 5, 5],
	wln = 1170 - mln[1] - mln[3],
	hln = 600 - mln[0] - mln[2];
	
var xln = d3.time.scale().range([0,wln]),
	yln = d3.scale.linear().range([hln, 0]),
	xAxisLn = d3.svg.axis().scale(xln).tickSize(-hln),
	yAxisLn = d3.svg.axis().scale(yln).ticks(5).orient("left"),
	parse = d3.time.format("%Y-%m-%d").parse;
	
var line = d3.svg.line()
	.interpolate("basic")
	.x(function(d) { return xln(d.date); })
	.y(function(d) { return yln(d.jumlah); });
	
var values;
d3.json("data/chartjson.php" , function(data) {
	console.log(data);	
	data.forEach(function(d){
		d.date = parse(d.date);
		d.jumlah = +d.jumlah;
	});
	
	values = data.filter(function(d) {
		return d.orientasi == "netral";
	});
	
	xln.domain([values[0].date, values[values.length - 1].date]);
	yln.domain([0, d3.max(values, function(d) { return d.jumlah; })]).nice();
	
	var svg = d3.select(".linechart").append("svg:svg")
		.attr("width", wln + mln[1] + mln[3])
		.attr("height", hln + mln[0] + mln[2])
	 .append("svg:g")
	 	.attr("transform", "translate('5,5')");
	 
	svg.append("svg:clipPath")
		.attr("id", "clip")
	 .append("svg:rect")
	 	.attr("width", wln)
	 	.attr("height", hln)
	
	svg.append("svg:g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxisLn);
      
	svg.append("svg:g")
	  .attr("class", "yaxis")
	  .attr("transform", "translate(20," + w + ")")
	  .call(yAxisLn);
	  
	svg.append("svg:path")
		.attr("class", "line")
		.attr("clip-path", "url(#clip)")
		.attr("d", line(values)	); 	
});