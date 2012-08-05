
var m = [20, 20, 30, 20],
    w = 1170 - m[1] - m[3],
    h = 350 - m[0] - m[2];

var 
    duration = 1500,
    delay = 500;

var monthNames = [ "January", "February", "March", "April", "May", "June",
	 "July", "August", "September", "October", "November", "December" ];



var color = d3.scale.category10();
var clor = d3.scale.ordinal().domain(["negatif","nonopini","positif"]).range(["#FF0000","#009900","#0099FF"]);
var x = d3.time.scale().range([0, w - 60]);
var y = d3.scale.linear().range([h , 0]);
var xAxis = d3.svg.axis()
			.scale(x).tickSize(-h).tickPadding(10)
			.ticks(d3.time.days).tickFormat(d3.time.format("%d/%b"));
var yAxis = d3.svg.axis()
			    .scale(y).tickSize(-w+60).ticks(3);
	
var allsvg = d3.select("#linechart").append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2]);

var backsvg = allsvg.append("svg:g")
	.attr("class","theAxis")
	.attr("transform", "translate(" + 50 + "," + m[0] + ")");
	
var linesvg= allsvg.append("svg:g")
	.attr("class","theLines")
    .attr("transform", "translate(" + 50 + "," + m[0] + ")");

var circsvg = allsvg.append("svg:g")
	.attr("class","theCircles")
	.attr("transform", "translate(" + 50 + "," + m[0] + ")");

var dataset,
    orientasi,
	datess,
	datadates,
	datacirc,
	maxtemp,
	circ,
	g;

	

// A line generator, for the dark stroke.
var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.jumlah); });

// A line generator, for the dark stroke.
var axis = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(h);

// A area generator, for the dark stroke.
var area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y1(function(d) { return y(d.price); });

d3.csv("data/linecsv.php", function(data) {

//console.log("data");
//console.log(data);

var parse = d3.time.format("%Y-%m-%d").parse;
	
	data.forEach(function(d){
		d.date = parse(d.date);
		d.jumlah = +d.jumlah;
	});
	
  // Nest stock values by symbol.
  orientasi = d3.nest()
      .key(function(d) { return d.orientasi; })
      .entries(dataset = data);

	//console.log("datess");
	//console.log(datess);
	//console.log(datess.length);
	

//console.log("orientasi nest: ");
//console.log(orientasi);

  // Parse dates and numbers. We assume values are sorted by date.
  // Also compute the maximum price per symbol, needed for the y-domain.
  orientasi.forEach(function(s) {
 
    s.maxJumlah = d3.max(s.values, function(d) { return d.jumlah; });
    s.sumJumlah = d3.sum(s.values, function(d) { return d.jumlah; });
	//console.log(s.maxJumlah);
  });
	maxtemp = d3.max(orientasi.map(function(d){ return d.maxJumlah}), function(d){ return d;}) + 200;
	//console.log(maxtemp);
	
//console.log("orientasi parsed: ");
//console.log(orientasi);

  // Sort by maximum price, descending.
  //orientasi.sort(function(a, b) { return b.maxJumlah - a.maxJumlah; });

//console.log("orientasi sorted :");
//console.log(orientasi);
  
   g = linesvg.selectAll(".theLines")
      .data(orientasi)
    .enter().append("svg:g")
      .attr("class", "symbol"); 
  
  var c = circsvg.selectAll(".theCircle")
		.data(data)
	.enter().append("svg:g")
		.attr("class","points");


	y.domain([0,maxtemp]);
	//console.log(datess.map(function(d,i){ return d.key;}).length);
  // Compute the minimum and maximum date across orientasi.
  x.domain([d3.min(orientasi, function(d) { return d.values[0].date; }),d3.max(orientasi, function(d) { return d.values[d.values.length - 1].date; })]);

  base();
  lines();
  circles();
  startBrush();
	


	
});


function base() {
	backsvg.append("svg:g")
		.attr("class","xAxis")
		.attr("transform", "translate(0," + h+ ")")
		.call(xAxis);
		
	backsvg.append("svg:g")
		.attr("class","yAxis")
		.call(yAxis.orient("left"));
		
		
}

function circles() {
	var c = circsvg.selectAll(".points");
	
	//console.log(c);
	
	c.each(function(d){
		var e = d3.select(this);
		
		e.append("svg:circle")
		.attr("title",function() {
			var d = this.__data__; 
			var pDate = d.date;
			return showData(pDate, d.jumlah, d.orientasi);})
		.attr("r", 4)
		.attr("class", "apoint")
		.style("fill", "#fff")
		.style("stroke-width", "1px")
		.style("stroke", function(d){ return clor(d.orientasi);})
		.attr("cx",function(d){ return x(d.date);})
		.attr("cy",function(d){ return y(d.jumlah);})
			.style("opacity", "0")
			.transition().duration(1000).delay(500)
			.style("opacity", "1");
			});
	
	
}

function lines() {
  var g = linesvg.selectAll(".symbol")
      .attr("transform", "translate(0," + 0 + ")");
  	
		//console.log(g);
  g.each(function(d) {
    var e = d3.select(this);

    e.append("svg:path")
        .attr("class", "line")
		.attr("d", function(d) { 
			return line(d.values); })
		.style("stroke", function(d) {
			return clor(d.key); })
		.style("opacity", "0")
		.transition().duration(500).delay(500)
		.style("opacity", "1");
  });


	
	$('.points').tooltipsy({
		show: function() {
			var d = this.__data__;
			console.log(this); 
			var pDate = d.date;
			return showData(pDate, d.jumlah, d.orientasi);},
		alignTo: 'cursor',
		    offset: [10, 10],
		css: {
		        'padding': '10px',
		        'max-width': '200px',
		        'color': '#303030',
		        'background-color': '#f5f5b5',
		        'border': '2px solid #deca7e',
		        '-moz-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
		        '-webkit-box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
		        'box-shadow': '0 0 10px rgba(0, 0, 0, .5)',
		        'text-shadow': 'none'
		    }
	});
	/*
	$('.points').tipsy({ 
    gravity: $.fn.tipsy.autoWE,
	fade: true,
	delayOut: 1500,
 	opacity: 0.8,
	trigger: 'hover',
    html: true, 
    title: 
		function() {
			var d = this.__data__; 
			var pDate = d.date;
			return showData(pDate, d.jumlah, d.orientasi);
			
			//return 'Tanggal: ' + pDate.getDate() + " " + monthNames[pDate.getMonth()] + " at " + pDate.getHours() + ':'+ pDate.getMinutes() +'<br>Jumlah tweet '+d.orientasi+':' +d.jumlah; 
    	}
  	});
	*/
		
}

function showData(aDate, bJumlah, cOrientasi){
	return "Info: <b>" + aDate.getDate() + " " + monthNames[aDate.getMonth()] + "</b> at <b>" + aDate.getHours() + ":"+ aDate.getMinutes() +"</b><br>Jumlah tweet <i>"+cOrientasi+"</i>:<b>" +bJumlah+"</b>";
}

function startBrush() {
	
			g.append("g")
			    .attr("class", "brush")
			    .call(d3.svg.brush().x(x)
			    .on("brushstart", brushstart)
			    .on("brush", brushmove)
			    .on("brushend", brushend))
			  .selectAll("rect")
			    .attr("height", h);

				var selpoint = circsvg.selectAll("circle");
				//console.log(selpoint);
				function brushstart() {
				  selpoint.classed("selecting", true);
				}

				function brushmove() {
				  var s = d3.event.target.extent();
					//console.log(s);
				  selpoint.classed("selected", function(d) { 
					//console.log(s[0] <= (d = x(d)) && d <= s[1]);
					return s[0] <= (d = x(d)) && d <= s[1]; });
				}

				function brushend() {
					var s = d3.event.target.extent();

				  selpoint.classed("selecting", !d3.event.target.empty());
				}
}
