var svgbar = d3.select("#bar").append('svg')
    .attr('width', barchart.width + barchart.margin[1])
    .attr('height', barchart.height + barchart.margin[1])
  .append('g')
    .attr("transform", gc.translate(0,15))
    .on("click.bar", function(){
        d3.selectAll('.values').attr('opacity', 1).transition().delay(3000).duration(1000).attr('opacity',0);
    });

var baredges = svgbar.append("rect")
      .attr("class","edges")
      .attr("width", barchart.width-10)
      .attr("height",  barchart.height-15)
      .attr("transform", gc.translate(0,-15))
      .attr("fill","#fff")
      .style("stroke-width","2px");


function initbarchart() {
	d3.json('data/barchartjson.php' , function(data) {
	 var ordered = gc.orderArray(data);
	  drawbarchart(ordered);
	});
}

function drawbarchart(data) {
	  barchart.xScale.domain([0, 22000]);
	  barchart.yScale.domain(gc.domainOrientasi);
	  //txbar.domain(data.map(function(d) { return d.orientasi; }));
	  var bar = svgbar.selectAll('g.bar')
		  .data(data)
		.enter().append('g')
		  .attr('class', 'bar')
		  .attr('transform', function(d) { return gc.translate(5, barchart.yScale(d.orientasi)/2); });

	  bar.append('rect')
	  	.attr('class', 'barchartbgbar')
	  	.attr('width', (barchart.width-barchart.margin[2]))
	  	.attr('height', barchart.yScale());

	  svgbar.append('g')
 		.attr('class', 'barchartxaxis textUnselectable')
        .attr('transform', gc.translate(10,0))
	 	.call(barchart.xAxis);

	  bar.append('rect')
	  	  .attr('id', 'activebar')
		  .style('fill', function(d) { return gc.colorOrientasi(d.orientasi);})
		  .attr('width', 0)
		  .attr('height', barchart.yScale())
		.transition().delay(gc.delay[0]).duration(gc.duration[3])
		  .attr('width', function(d) { return barchart.xScale(d.jumlah); });

      /*
	  bar.append("text")
	  	  .attr("class", "tekstatis")
	  	  .attr("x", 0)
		  .attr("y", hghtbar.rangeBand())
		  .attr("dx", 0)
		  .attr("dy", ".15em")
		  .attr("text-anchor", "start")
		  .attr("fill", function(d) { return clorbar(d.orientasi);})
		  .style("font", "7pt Arial")
		  .style("text-shadow", "1px 1px 1px rgba(0,0,0,.3)")
		  .text(function(d,i) { return txbar(i) });
	  */
	  bar.append('text')
		  .attr('class', 'values')
		  .attr('id', 'jumlahtiap')
		  .attr('x', 0)
		  .attr('y', barchart.yScale.rangeBand() - barchart.margin[1])
		  .attr('dx', 0)
		  .attr('dy', '0em')
		  .attr('text-anchor', 'start')
		  .attr('fill', function(d) { return gc.colorOrientasi(d.orientasi);})
		  .style('text-shadow', '1px 1px 1px rgba(0,0,0,0.1)')
		  .style('font', '8pt Arial Narrow')
		  .attr('opacity', 1)
		  .text(function(d) { return gc.format(d.jumlah); })
		.transition().delay(gc.delay[0]).duration(gc.duration[4])
		  .attr('dx', function(d) { return barchart.xScale(d.jumlah) + 3; })
		.transition().delay(3000).duration(4500)
		  .attr('opacity', 0);

	var totaltweet = d3.select('#totaltweet').append('text')
		  .text(d3.sum(data, function(d) { return d.jumlah; }));
}

function updatebarchart(date1, date2) {

	var barchartjson = 'data/barchartjson.php?df='+ date1 + '&dl='+ date2;
	//console.log(barchartjson);
	d3.json(barchartjson, function(data) {
	  var ordered = gc.orderArray(data);
	  redrawbarchart(ordered);
	});
}

function redrawbarchart(data) {
  	/*console.log("SUM datanew: "+ d3.sum(data, function(f) { return f.jumlah; }));
	  console.log("Array datanew: ");
	  console.log(data);*/
	  var updatebar = svgbar.selectAll('#activebar').data(data);
	  var updatetiapjumlah = svgbar.selectAll('#jumlahtiap').data(data);

	  updatetiapjumlah.attr('opacity', 1)
	      .transition().delay(gc.delay[1]).duration(gc.duration[4])
	  		.text(function(d) { return gc.format(d.jumlah); })
		  	.attr('dx', function(d) { return barchart.xScale(d.jumlah) + 2; })
          .transition().delay(4000).duration(2000)
                                  .attr('opacity', 0);

	  updatebar
	  	.transition().duration(gc.duration[3])
			.attr('width', function(d) {
			//console.log("updt width: wdthbar("+d.jumlah+") = "+wdthbar(d.jumlah));
			return barchart.xScale(d.jumlah); });
}


