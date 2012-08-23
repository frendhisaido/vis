
var m = [20, 30, 40, 50, 60],
    w = 1000 ,
    h = 300,
    h2 = 80 + m[0];
	
	
var duration = 1500,
    delay = 500;
    

var monthNames = [ "January", "February", "March", "April", "May", "June",
	 "July", "August", "September", "October", "November", "December" ];


var clor = d3.scale.ordinal().domain(["negatif","positif","nonopini"]).range(["#FF0000","#009900","#0099FF"]);
var x = d3.time.scale().range([0, w - m[4] ]),
    xContext = d3.time.scale().range([0, w - m[4] ]),
    y = d3.scale.linear().range([h , 0]),
    yContext = d3.scale.linear().range([h2, 0]);
	
var xAxis = d3.svg.axis()
		.scale(x)
		.tickSize(-h)
		.tickPadding(10);
		      //.ticks(d3.time.days).tickFormat(d3.time.format("%d/%b"));

var xAxisContext = d3.svg.axis()
		      .scale(xContext)
		      .tickSize(-h2)
		      .tickPadding(10)
		      .ticks(8);				
				  
var yAxis = d3.svg.axis()
	    .scale(y)
	    .tickSize(-w+m[4])
	    .ticks(5);
			
var yAxisContext = d3.svg.axis()
		  .scale(yContext)
		  .tickSize(-w+m[4])
		  .ticks(2);
	
var allsvg = d3.select("#linechart").append("svg:svg")
	    .attr("class","view")
	    .attr("width", w + m[1] + m[3])
	    .attr("height", h + m[0] + m[2]);
    //!!!!IMPORTANT, Clipping path supaya ga melebihi axis
    //Setelah diset disini, diset lagi attr("clip-path", "url(#clip)") di elemen yang mau diisi pathnya
    allsvg.append("defs").append("clipPath")
	  .attr("id", "clip")
	  .append("rect")
	  .attr("width", w - m[4])
	  .attr("height", h);

/*
 *
 *
 */
var contsvg = d3.select("#context").append("svg:svg")
	      .attr("width", w + m[1] + m[3])
	      .attr("height", h2);

var backsvg = allsvg.append("svg:g")
	      .attr("class","theAxis")
	      .attr("transform", "translate(" + m[1] + "," + 0 + ")");

var contextbacksvg = contsvg.append("svg:g")
		     .attr("class","contAxis")
		     .attr("transform","translate(" + m[1] + "," + 0 + ")");

var linesvg= allsvg.append("svg:g")
	    .attr("class","theLines")
	    .attr("transform", "translate(" + m[1] + "," + 0 + ")");

var circsvg = allsvg.append("svg:g")
	     .attr("class","theCircles")
	     .attr("transform", "translate(" + m[1] + "," + 0 + ")");

var contextsvg = contsvg.append("svg:g")
		 .attr("class","theContext")
		 .attr("transform", "translate(" + m[1] + "," + 0 + ")");




var line = d3.svg.line()
	  .interpolate("linear")
	  .x(function(d) { return x(d.date); })
	  .y(function(d) { return y(d.jumlah); });

var line2 = d3.svg.line()
	    .interpolate("bundle")
	    .x(function(d) { return xContext(d.date);})
	    .y(function(d){ return yContext(d.jumlah)});


var axis = d3.svg.line()
	  .interpolate("basis")
	  .x(function(d) { return x(d.date); })
	  .y(h);


var area = d3.svg.area()
	  .interpolate("basis")
	  .x(function(d) { return x(d.date); })
	  .y1(function(d) { return y(d.price); });

var brush = d3.svg.brush()
	  .x(xContext)
	  .on("brush", zoom);

var stillpositif;

d3.csv("data/linecsv.php", function(data) {

//console.log("data");
//console.log(data);
datacontext = data;

var parse = d3.time.format("%Y-%m-%d %H").parse;


  data.forEach(function(d){
	  d.date = parse(d.date);
	  d.jumlah = +d.jumlah;
  });

  orientasi = d3.nest()
      .key(function(d) { 
		return d.orientasi; })
      .entries(data);

  orientasi.forEach(function(s) {
    s.maxJumlah = d3.max(s.values, function(d) { return d.jumlah; });
     //console.log(s.maxJumlah);
    s.sumJumlah = d3.sum(s.values, function(d) { return d.jumlah; });
  });
	maxtemp = d3.max(orientasi.map(function(d){ return d.maxJumlah}),
			 function(d){ return d;}) + 10; //penambahan supaya line tidak menyentuh bagian atas chart
	maxpositif = d3.max(orientasi.map(function(d){ return d.key == "positif"? d.maxJumlah : 0},
					  function(d){ return d;})) + 5;
  
  linesvg.selectAll(".theLines")
      .data(orientasi)
    .enter().append("svg:g")
      .attr("class", "symbol"); 

  contextsvg.selectAll(".theContexts")
		.data(orientasi)
	.enter().append("svg:g")
		.attr("class", "context");
		
  circsvg.selectAll(".theCircle")
		.data(data)
	.enter().append("svg:g")
		.attr("class","points");

		
	
	x.domain([d3.min(orientasi, function(d) { return d.values[0].date; }),
		  d3.max(orientasi, function(d) { return d.values[d.values.length - 1].date; })]);
	xContext.domain(x.domain());
	y.domain([0,maxtemp]);
	yContext.domain(y.domain());
	
	//console.log("xdomain", x.domain());

  base();
  draw();
  //circles();
	


	
});
function drawmaincontext(){
  maincontextbacksvg.append("svg:g")
			.attr("class", "xMainContextAxis")
			.call(xAxisContextMain);
			
  var m = maincontextsvg.selectAll(".symbol");
  
  m.each(function(d) {
    var e = d3.select(this);

    e.append("svg:path")
	.attr("class", "linecontext")
		.attr("id", function(d){
		  var ids = 'line_'+d.key;
		  return ids;
		})
		.attr("d", function(d) { 
			return line(d.values); })
		.style("stroke-width", "1px")
		.style("stroke", function(d) {
			return clor(d.key); })
		.style("opacity", "0")
		.transition().duration(500).delay(500)
		.style("opacity", "1");
  });
  
}


function base() {
	backsvg.append("svg:g")
		.attr("class","xAxis")
		.attr("transform", "translate(0," + h+ ")")
		.call(xAxis);
		
	backsvg.append("svg:g")
		.attr("class","yAxis")
		.call(yAxis.orient("left"));
		
		contextbacksvg.append("svg:g")
			.attr("class","xContextAxis")
			.attr("transform", "translate(0," + (h2-20)+ ")")
			.call(xAxisContext);
		
		
}


function draw() {
  
  //var = maincontextsvg.selectAll
  
  
  var g = linesvg.selectAll(".symbol")
		.attr("clip-path", "url(#clip)");
      //.attr("transform", "translate(0," + 100 + ")");
	
		//console.log(g);
  g.each(function(d) {
    var e = d3.select(this);

    e.append("svg:path")
	.attr("class", "line")
		.attr("id", function(d){
		  var ids = 'line_'+d.key;
		  return ids;
		})
		.attr("d", function(d) { 
			return line(d.values); })
		.style("stroke-width", "1px")
		.style("stroke", function(d) {
			return clor(d.key); })
		.style("opacity", "0")
		.transition().duration(500).delay(500)
		.style("opacity", "1");
  });

 var cx = contextsvg.selectAll(".context")
			.attr("transform", "translate(0," + -20+ ")");
			
  cx.each(function(d) {
    var e = d3.select(this);

    e.append("svg:path")
	.attr("class", "linecontext")
		.attr("d", function(d) { 
			return line2(d.values); })
		.style("stroke", function(d) {
			return clor(d.key); })
		.style("opacity", "0")
		.transition().duration(500).delay(500)
		.style("opacity", "1");
  });

	contextsvg.append("g")
	      .attr("class", "x brush")
	      .call(brush)
	    .selectAll("rect")
	      .attr("y", -6)
	      .attr("height", h2 -13);
	      

var c = circsvg.selectAll(".points")
	    .attr("clip-path", "url(#clip)")
	    .on("mouseover", function(d){
			console.log(showData(d.date, d.jumlah, d.orientasi));
			});
  
  c.each(function(d){
    var e = d3.select(this);
    e.append("svg:circle")
    .attr("r", circlesize() )
    .attr("id", function(d){
		  var ids = 'circ_'+d.orientasi;
		  return ids;
		})
    .attr("class", "apoint")
      .style("fill", function(d){ return clor(d.orientasi);})
    .attr("stroke-width", "0px")
    .attr("cx" , function(d){ return x(d.date);})
    .attr("cy" , function(d){ return y(d.jumlah);})
		.style("opacity", "0")
		.transition().duration(500).delay(1000)
		.style("opacity", "1");
    
  });
}


function zoom() {
  var maxyaxis;
  if(stillpositif){
    maxyaxis = maxpositif;
  }else{
    maxyaxis = maxtemp;
  }
  x.domain(brush.empty() ? xContext.domain() : brush.extent());
  y.domain([0, maxyaxis]);
  
  var diffmili = brush.extent()[1].getTime() - brush.extent()[0].getTime();
  var diffhours = ( diffmili / 1000 ) / 60 / 60;
  diffhours = Math.log(Math.ceil(diffhours));
  var brushsize = Math.ceil(diffhours);
  
  redraw(brushsize);
}

function redraw(brushsize){
  
  var recirc = circsvg.selectAll(".theCircles circle");
	recirc.each(function(d){
	    var e = d3.select(this);
	    e.attr("cx" , function(d){ return x(d.date);})
	    .attr("cy" , function(d){ return y(d.jumlah);})
	    .attr("r" , circlesize(brushsize));
	});
	
  var reline = linesvg.selectAll(".theLines path");
	reline.each(function(d){
		var e = d3.select(this);
		e.attr("d",line(d.values))
		.style("stroke-width", linewidth(brushsize));
	});
  
  backsvg.select(".xAxis").call(xAxis);
  backsvg.select(".yAxis").call(yAxis);
}


function circlesize(brushsize){
    var sz;
    if (brushsize == 5) {
      return sz = 3;
    }else if(brushsize >= 3 && brushsize < 5) {
      return sz = 4; 
    }else if(brushsize >= 0 && brushsize <= 2){
      return sz = 5;
    }else{
      return 2; //default circlesize;
    }
}

function linewidth(brushsize){
    var sz;
    if (brushsize == 5) {
      return sz = "2px";
    }else if(brushsize >= 3 && brushsize < 5) {
      return sz = "2.5px"; 
    }else if(brushsize >= 0 && brushsize <= 2){
      return sz = "3px";
    }else{
      return 1;
    }
}

function onlypositif(){
  stillpositif = true;
  hideline("negatif");
  hideline("nonopini");
  x.domain(brush.empty() ? xContext.domain() : brush.extent());
  y.domain([0, maxpositif]);
  
  var diffmili = brush.extent()[1].getTime() - brush.extent()[0].getTime();
  var diffhours = ( diffmili / 1000 ) / 60 / 60;
  diffhours = Math.log(Math.ceil(diffhours));
  var brushsize = Math.ceil(diffhours);
  
  redraw(brushsize);
}

function showAll(){
  stillpositif = false;
  showline("negatif");
  showline("nonopini");
}

function hideline(ornt) {
	var selectedline = '#line_'+ornt;
	var selectedcirc = '#circ_'+ornt;
	
	var reline = linesvg.select(selectedline);
	var recirc = circsvg.selectAll(selectedcirc);
	reline
	.transition().duration(500)
	.style("opacity",0);
	
	recirc
	.transition().duration(500)
	.style("opacity",0);
}

function showline(ornt) {
	var selectedline = '#line_'+ornt;
	var selectedcirc = '#circ_'+ornt;
	
	var reline = linesvg.select(selectedline);
	var recirc = circsvg.selectAll(selectedcirc);
	reline
	.transition().duration(500)
	.style("opacity",1);
	
	recirc
	.transition().duration(500)
	.style("opacity",1);
}

function showData(aDate, bJumlah, cOrientasi){
	  return "Info: " + aDate.getDate() + " "
	  + monthNames[aDate.getMonth()] + " at "
	  + aDate.getHours() + ":"
	  + aDate.getMinutes() +" Jumlah tweet "
	  +cOrientasi+":" +bJumlah;
	}

 

