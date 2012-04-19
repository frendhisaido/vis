	var m = [30, 5, 5, 5],
		w = 375 - m[1] - m[3],
		h = 260 - m[0] - m[2];
	
	var format = d3.format(",.0f");
	
	var x = d3.scale.linear().range([0, w]),
		y = d3.scale.ordinal().rangeRoundBands([0, h], .1),
		z = d3.scale.ordinal().range(["red","green","blue"]),
		o = d3.scale.ordinal().range(["NEGATIF","POSITIF","NETRAL"]);
	
	var xAxis = d3.svg.axis().scale(x).orient("top").ticks(5);
		
	
	var svg = d3.select("#bar").append("svg")
		.attr("width", w + m[1] + m[3])
		.attr("height", h + m[0] + m[2])
	  .append("g")
		.attr("transform", "translate(" + m[3] + "," + m[0] + ")");
	
	d3.json("data/barchartjson.php", function(data) {
	
	  // Parse numbers, and sort by value.
	  data.forEach(function(d) { d.jumlah = +d.jumlah; });
	  data.sort(function(a, b) { return b.jumlah - a.jumlah; });
	
	  // Set the scale domain.
	  x.domain([0, d3.sum(data, function(d) { return d.jumlah; })]);
	  y.domain(data.map(function(d) { return d.orientasi; }));
	  o.domain(data.map(function(d) { return d.orientasi; }));
	  z.domain(["negatif","positif","netral"]);
	

	  	  
	  var bar = svg.selectAll("g.bar")
		  .data(data)
		.enter().append("g")
		  .attr("class", "bar")
		  .attr("transform", function(d) { return "translate(0," + y(d.orientasi) + ")"; });
	
	  bar.append("rect")
		  .attr("width", w)
		  .attr("height", y.rangeBand())
		  .style("fill", "#C9C9C9");
	  
	  bar.append("text")
	  	  .attr("class", "value")
	  	  .attr("x", 0)
		  .attr("y", y.rangeBand() / 6)
		  .attr("dx", 4)
		  .attr("dy", ".35em")
		  .attr("font-size", 12)
		  .attr("text-anchor", "start")
		  .text(function(d,i) { return o(i) })
		.transition()
    	.delay(100)
    	.duration(1000)  
		  .attr("x", function(d) { return x(d.jumlah); });
		  
	  bar.append("rect")
		  .style("stroke","black")
		  .attr("width", 0)
		  .attr("height", y.rangeBand())
		.transition()
    	.delay(100)
    	.duration(1000)    
		  .attr("width", function(d) { return x(d.jumlah); })
		  .style("fill-opacity", 0.8)
		  .style("fill", function(d) { return z(d.orientasi);});
	
	  bar.append("text")
		  .attr("class", "value")
		  .attr("x", 0)
		  .attr("y", y.rangeBand() - 10)
		  .attr("dx", 4)
		  .attr("dy", ".35em")
		  .attr("font-size", 12)
		  .attr("text-anchor", "start")
		  .text(function(d) { return format(d.jumlah); })
		.transition()
    	.delay(100)
    	.duration(1000)  
		  .attr("x", function(d) { return x(d.jumlah); });
		
	  svg.append("text")
		  .attr("class", "value")
		  .attr("x", "98%")
		  .attr("y", "78%")
		.transition()
    	.delay(100)
    	.duration(1000)  
		  .attr("dx", -3)
		  .attr("dy", ".35em")
		  .attr("text-anchor", "end")
		  .style("font", "24pt Helvetica")
		  .style("text-shadow", "3px 3px 3px rgba(0,0,0,.4)")
		  .text(d3.sum(data, function(d) { return d.jumlah; }));	
		  
	  svg.append("g")
		  .attr("class", "xaxis")
		  .call(xAxis);
	});