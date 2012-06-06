var mbar = [5, 10, 20, 25], 
wbar = 370 - mbar[1] - mbar[1], 
hbar = 260 - mbar[0] - mbar[2]; 

var format = d3.format(",.0f"); 
var wdthbar = d3.scale.linear().range([0, wbar]),
	hghtbar = d3.scale.ordinal().rangeRoundBands([0, hbar], .1),
	clorbar = d3.scale.ordinal().domain(["negatif","positif","netral"]).range(["#FF0000","#009900","#0099FF"]),
	txbar = d3.scale.ordinal().range(["NEGATIF","POSITIF","NETRAL"]),
	xAxisbar = d3.svg.axis().scale(wdthbar).tickSubdivide(true).orient("top").tickSize(-hbar).tickValues([1000,3000,5000,10000,13000,15000]);
	
var svgbar = d3.select("#bar").append("svg")
	.attr("width", wbar + mbar[3] + mbar[3])
	.attr("height", hbar + mbar[3] + mbar[3])
  .append("g")
	.attr("transform", "translate(" + mbar[1] + "," + mbar[1] + ")");
	
  svgbar.append("rect")
	.attr("height", 1)
	.attr("width", wbar)
	.attr("x",0)
	.attr("y",8);

function initbarchart() {
	d3.json("data/barchartjson.php" , function(data) { 
	  data.sort(function(a, b) { return b.jumlah - a.jumlah; });
	  drawbarchart(data);
	});
}

function drawbarchart(data) {
  	data.sort(function(a, b) { return b.jumlah - a.jumlah; });
	  wdthbar.domain([0,18000]);
	  hghtbar.domain(data.map(function(d) { return d.orientasi; })); //(["Negatif", "Positif", "Netral"])
	  txbar.domain(data.map(function(d) { return d.orientasi; })); 
  
	  var bar = svgbar.selectAll("g.bar")
		  .data(data)
		.enter().append("g")
		  .attr("class", "bar")
		  .attr("transform", function(d) { return "translate(0," + hghtbar(d.orientasi) + ")"; });
  
	  bar.append("rect")
	  	.attr("class", "bgbar")
	  	.attr("width", wbar)
	  	.attr("height", hghtbar.rangeBand()-mbar[1]);
	
	  svgbar.append("g")
 		.attr("class", "xaxis")
		.attr("transform", "translate(0," + 9 + ")")
	 	.call(xAxisbar);

	  bar.append("rect")
	  	  .attr("id", "activebar") 
		  .style("fill", function(d) { return clorbar(d.orientasi);}) 
		  .attr("width", 0)
		  .attr("height", hghtbar.rangeBand()-mbar[1])
		.transition().delay(60).duration(1000)    
		  .attr("width", function(d) { return wdthbar(d.jumlah); });
    
	  bar.append("text")
	  	  .attr("class", "tekstatis")
	  	  .attr("x", 0) 
		  .attr("y", hghtbar.rangeBand())
		  .attr("dx", 0) 
		  .attr("dy", ".15em")
		  .attr("text-anchor", "start")
		  .attr("fill", function(d) { return clorbar(d.orientasi);})
		  .style("font", "8pt Arial")
		  .style("text-shadow", "2px 2px 2px rgba(0,0,0,.3)") 
		  .text(function(d,i) { return txbar(i) });
	  
	  bar.append("text")
		  .attr("class", "values")
		  .attr("id", "jumlahtiap")
		  .attr("x", 0)
		  .attr("y", hghtbar.rangeBand()-15)
		  .attr("dx", 0)
		  .attr("dy", ".15em")
		  .attr("text-anchor", "start")
		  .attr("fill", function(d) { return clorbar(d.orientasi);})
		  .style("text-shadow", "2px 2px 2px rgba(0,0,0,0.2)") 
		  .style("font", "10pt Arial Narrow")
		  .text(function(d) { return format(d.jumlah); })
		.transition().delay(100).duration(1500)
		  .attr("dx",function(d) { return wdthbar(d.jumlah)+2; }); 	  
  		
	  svgbar.append("text")
		  .attr("class", "values")
		  .attr("id","teksjumlah")
		  .attr("x", "90%")
		  .attr("y", hbar)
		  .attr("dx", -15)
		  .attr("dy", ".35em")
		  .attr("text-anchor", "end")
		  .style("font", "10pt Arial Narrow")
		  .style("text-shadow", "1px 1px 1px rgba(0,0,0,.4)") 
		  .text("Jumlah total tweet : "+d3.sum(data, function(d) { return d.jumlah; }));	
}

function updatebarchart(date1, date2) {
	var barchartjson = "data/barchartjson.php?df="+date1+"&dl="+date2;
	d3.json(barchartjson , function(data) { 
	  data.sort(function(a, b) { return b.jumlah - a.jumlah; });
	  redrawbarchart(data);
	});
}

function redrawbarchart(data) {
  	/*console.log("SUM datanew: "+ d3.sum(data, function(f) { return f.jumlah; }));
	  console.log("Array datanew: ");
	  console.log(data);*/
	  var updatebar = svgbar.selectAll("#activebar").data(data);
	  var updateteksjumlah = svgbar.selectAll("#teksjumlah");
	  var updatetiapjumlah = svgbar.selectAll("#jumlahtiap").data(data);

	  updatetiapjumlah.transition().delay(100).duration(1500)
	  		.text(function(d) { return format(d.jumlah); })
		  	.attr("dx",function(d) { return wdthbar(d.jumlah)+2; }); 
  		
	  updateteksjumlah.transition().duration(500)
	  		.text("Jumlah total tweet :"+d3.sum(data, function(d) { 
	  		//console.log("Teks Jumlah: "+ d.jumlah);
	  		return d.jumlah; }));
  		
	  updatebar
	  	.transition().duration(1000)
			.attr("width", function(d) { 
			//console.log("updt width: wdthbar("+d.jumlah+") = "+wdthbar(d.jumlah));
			return wdthbar(d.jumlah); });
}
initbarchart();

	