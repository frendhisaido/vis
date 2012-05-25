var m = [5, 10, 20, 25], 
w = 370 - m[1] - m[1], 
h = 260 - m[0] - m[2]; 

var format = d3.format(",.0f"); 
var data;
var wdth = d3.scale.linear().range([0, w]),
	hght = d3.scale.ordinal().rangeRoundBands([0, h], .1),
	clor = d3.scale.ordinal().domain(["negatif","positif","netral"]).range(["#FF0000","#0099FF","#009900"]),
	tx = d3.scale.ordinal().range(["NEGATIF","POSITIF","NETRAL"]),
	xAxis = d3.svg.axis().scale(wdth).tickSubdivide(true).orient("top").tickSize(-h).tickValues([1000,3000,5000,10000,13000,15000]);
	
var svg = d3.select("#bar").append("svg")
	.attr("width", w + m[3] + m[3])
	.attr("height", h + m[3] + m[3])
  .append("g")
	.attr("transform", "translate(" + m[1] + "," + m[1] + ")");
	
  svg.append("rect")
	.attr("height", 1)
	.attr("width", w)
	.attr("x",0)
	.attr("y",8);

function init() {
	d3.json("data/barchartjson.php" , function(data) { 
	  data.sort(function(a, b) { return b.jumlah - a.jumlah; });
	  draw(data);
	});
}

function draw(data) {
  	data.sort(function(a, b) { return b.jumlah - a.jumlah; });
	  wdth.domain([0,18000]);
	  hght.domain(data.map(function(d) { return d.orientasi; })); //(["Negatif", "Positif", "Netral"])
	  tx.domain(data.map(function(d) { return d.orientasi; })); 
  
	  var bar = svg.selectAll("g.bar")
		  .data(data)
		.enter().append("g")
		  .attr("class", "bar")
		  .attr("transform", function(d) { return "translate(0," + hght(d.orientasi) + ")"; });
  
	  bar.append("rect")
	  	.attr("class", "bgbar")
	  	.attr("width", w)
	  	.attr("height", hght.rangeBand()-m[1]);
	
	  svg.append("g")
 		.attr("class", "xaxis")
		.attr("transform", "translate(0," + 9 + ")")
	 	.call(xAxis);

	  bar.append("rect")
	  	  .attr("id", "activebar") 
		  .style("fill", function(d) { return clor(d.orientasi);}) 
		  .attr("width", 0)
		  .attr("height", hght.rangeBand()-m[1])
		.transition().delay(60).duration(1000)    
		  .attr("width", function(d) { return wdth(d.jumlah); });
    
	  bar.append("text")
	  	  .attr("class", "tekstatis")
	  	  .attr("x", 0) 
		  .attr("y", hght.rangeBand())
		  .attr("dx", 0) 
		  .attr("dy", ".15em")
		  .attr("text-anchor", "start")
		  .attr("fill", function(d) { return clor(d.orientasi);})
		  .style("font", "8pt Arial")
		  .style("text-shadow", "2px 2px 2px rgba(0,0,0,.3)") 
		  .text(function(d,i) { return tx(i) });
	  
	  bar.append("text")
		  .attr("class", "values")
		  .attr("id", "jumlahtiap")
		  .attr("x", 0)
		  .attr("y", hght.rangeBand()-15)
		  .attr("dx", 0)
		  .attr("dy", ".15em")
		  .attr("text-anchor", "start")
		  .attr("fill", function(d) { return clor(d.orientasi);})
		  .style("text-shadow", "2px 2px 2px rgba(0,0,0,0.2)") 
		  .style("font", "10pt Arial Narrow")
		  .text(function(d) { return format(d.jumlah); })
		.transition().delay(100).duration(1500)
		  .attr("dx",function(d) { return wdth(d.jumlah)+2; }); 	  
  		
	  svg.append("text")
		  .attr("class", "values")
		  .attr("id","teksjumlah")
		  .attr("x", "90%")
		  .attr("y", h)
		  .attr("dx", -15)
		  .attr("dy", ".35em")
		  .attr("text-anchor", "end")
		  .style("font", "10pt Arial Narrow")
		  .style("text-shadow", "1px 1px 1px rgba(0,0,0,.4)") 
		  .text("Jumlah total tweet : "+d3.sum(data, function(d) { return d.jumlah; }));	
}

function updatebar(date1, date2) {
	var barchartjson = "data/barchartjson.php?df="+date1+"&dl="+date2;
	d3.json(barchartjson , function(data) { 
	  data.sort(function(a, b) { return b.jumlah - a.jumlah; });
	  redraw(data);
	});
}

function redraw(data) {
  	/*console.log("SUM datanew: "+ d3.sum(data, function(f) { return f.jumlah; }));
	  console.log("Array datanew: ");
	  console.log(data);*/
	  var updatebar = svg.selectAll("#activebar").data(data);
	  var updateteksjumlah = svg.selectAll("#teksjumlah");
	  var updatetiapjumlah = svg.selectAll("#jumlahtiap").data(data);

	  updatetiapjumlah.transition().delay(100).duration(1500)
	  		.text(function(d) { return format(d.jumlah); })
		  	.attr("dx",function(d) { return wdth(d.jumlah)+2; }); 
  		
	  updateteksjumlah.transition().duration(500)
	  		.text("Jumlah total tweet :"+d3.sum(data, function(d) { 
	  		//console.log("Teks Jumlah: "+ d.jumlah);
	  		return d.jumlah; }));
  		
	  updatebar
	  	.transition().duration(1000)
			.attr("width", function(d) { 
			//console.log("updt width: wdth("+d.jumlah+") = "+wdth(d.jumlah));
			return wdth(d.jumlah); });
}
init();

	