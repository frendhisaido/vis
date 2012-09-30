var m = [20, 35, 40, 50, 60],
    w = 1150 ,
    h = 300,
    h2 = 50 + m[0];

var parseJam = d3.time.format("%Y-%m-%d %H").parse;
var parseTanggal = d3.time.format("%Y-%m-%d").parse;


var duration = [100,200,500,1000,1500],
    delay = [500,1000];
    
var stillpositif,stillnegatif,stillnonop,stillhover;
var maxValue,maxpositif,maxnegatif,maxnonopini,maxYcurrent,maxgrouped;
var maxdate, mindate,currentAtom,callCSV;
var requestKeyWords, reqTweet, keyWords;
var bubbles;
var getTweetUrl = "data/gettweets.php";
var getKeywUrl = "data/getKeyword.php";

var monthNames = [ "January", "February", "March", "April", "May", "June",
	 "July", "August", "September", "October", "November", "December" ];


var clor = d3.scale.ordinal().domain(["negatif","positif","nonopini"]).range(["#FF0000","#009900","#FAA732"]);
var x = d3.time.scale().range([0, w - m[4] ]),
    xContext = d3.time.scale().range([0, w - m[4] ]),
    y = d3.scale.linear().range([h , 0]),
    yContext = d3.scale.linear().range([h2, 0])
    bubbleScale = d3.scale.linear().range([0, h/4]) ;
	
var xAxis = d3.svg.axis()
		.scale(x)
		.tickSize(-h)
		.tickPadding(10);
		      
var xAxisContext = d3.svg.axis()
		      .scale(xContext)
		      .tickSize(-h2)
		      .tickPadding(10)
		      .ticks(8)
		      .ticks(d3.time.days).tickFormat(d3.time.format("%d/%b"));				
				  
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
	    .attr("width", w)
	    .attr("height", h + m[0] + m[2])
	    .on("mouseover.chart", circopacity(1))
	    .on("mouseout.chart", circopacity(0));

var allbg = allsvg.append("rect")
	  .attr("width", w - m[4])
	  .attr("height", h)
	  .attr("transform","translate("+m[1]+",1)")
	  .attr("fill","#fff")
	  .style("stroke","none");
	  

	    
    //!!!!IMPORTANT, Clipping path supaya ga melebihi axis
    //(Setelah diset disini, diset lagi attr("clip-path", "url(#clip)") di elemen yang mau diisi pathnya
   allsvg.append("defs").append("clipPath")
  .attr("id", "clip")
	  .append("rect")
	  .attr("width", w - m[4])
	  .attr("height", h);
    
/*	 INI filter drop shadow buat line, dan udah bisa dipake, 
 *   tinggal disetel supaya mati pas lagi digeser
 *
var defs = allsvg.select("defs");
var filters= defs.append("filter").attr("id","dropshadow");

	filters.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",1);
	filters.append("feOffset").attr("dx",1).attr("dy",1).attr("result","offsetblur");
	filters.append("feBlend").attr("in","SourceGraphic").attr("mode","normal");
*/
var bubblesground = allsvg.append("svg:g")
	  .attr("class","theBubbles")
	  .attr("width", w)
	  .attr("height", h)
	  .attr("transform","translate("+m[1]+",1)")
	  .attr("fill","#fff")
	  .style("stroke","none");

var contsvg = d3.select("#context").append("svg:svg")
	      .attr("width", w + m[1] + m[3])
	      .attr("height", h2);
	      
var contbg = contsvg.append("rect")
	  .attr("width", w - m[4])
	  .attr("height", (h2 - m[0]))
	  .attr("transform", "translate(" + m[1] + "," + 0 + ")")
	  .attr("fill","#fff")
	  .style("stroke","#000")
	  .style("stroke-width","1px");
	
		


	
/*
 *
<filter id="drop-shadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0.5"/> 
                <feOffset dx="1" dy="1" result="offsetblur"/> 
                <feMerge> 
                    <feMergeNode/> 
                    <feMergeNode in="SourceGraphic"/> 
                </feMerge> 
</filter>
 *
 */


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
		 .attr("class","theContexts")
		 .attr("transform", "translate(" + m[1] + "," + 0 + ")");
		 
var edges = allsvg.append("rect")
	  .attr("width", w - m[4])
	  .attr("height", h)
	  .attr("transform","translate("+m[1]+",1)")
	  .attr("fill","none")
	  .style("stroke","#000")
	  .style("stroke-width","2px");
	  

		 
var loadbar = allsvg.append("svg:g")
			.attr("id","loading")
			.style("display","none");;
			
		loadbar.append("rect")
		.attr("transform","translate("+m[1]+",1)")
    	.attr("class","load")
    	.attr("fill","#ddd")
    	.style("opacity", "0.7")
    	.attr("width", w- m[4] )
	    .attr("height", h );
	    
		loadbar.append("text")
		.attr("x", (w/2-m[4]))
		.attr("y", (h/2))
		.attr("dx", 0) 
		  .attr("dy", ".15em")
		  .attr("text-anchor", "start")
		  .attr("fill", "#000")
		  .style("font", "20pt Arial")
		  .style("text-shadow", "2px 2px 2px rgba(0,0,0,.3)") 
		.text("Loading...");
		
		



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
	  .on("brush", redraw);

function resetViewControls() {
 		  	for (i=0; i < tog.length; i++){
 		  		tog[i].view = true;
 		  		$(tog[i].eye).attr("class","icon-eye-open");
 		  	}
 		  		$("#viewcontrols button").attr("class","btn btn-mini");
 		  		$("#viewcontrols button").removeAttr("disabled");
 		  }
function saddtop(maxY){
	if(maxY<50){
		maxY = maxY + 10;
	}else if(maxY > 500){
		maxY = maxY + 20;
	}else if(maxY > 1000){
		maxY = maxY + 100;
	}
	return maxY;
}
 		  
function initLineChart(atom,update){
	$("#loading").css("display","block");
	currentAtom = atom;
	callCSV ="data/linecsv.php?atom="+atom;
	var addtop = atom == 'perday'? 100 : 10;
	 //penambahan supaya line tidak menyentuh pojok atas chart
	
d3.csv(callCSV, function(data) {
//console.log("data");
//	console.log(data);

  data.forEach(function(d){
  	  d.tgl = d.date;
  	  //console.log(d.tgl);
	  d.date = atom == 'perday'? parseTanggal(d.date) : parseJam(d.date);
	  //console.log(d.date);
	  d.jumlah = +d.jumlah;
	  //console.log(d.jumlah);
  });
  
  orientasi = d3.nest()
      .key(function(d) { 
		return d.orientasi; })
      .entries(data);

  orientasi.forEach(function(d) {
    d.maxJumlah = d3.max(d.values, function(d) { return d.jumlah; });
     //console.log(s.maxJumlah);
    d.sumJumlah = d3.sum(d.values, function(d) { return d.jumlah; });
  });
	maxValue = d3.max(orientasi.map(function(d){ return d.maxJumlah}),
			 function(d){ return d;}) + addtop; 
	maxpositif = d3.max(orientasi.map(function(d){ return d.key == "positif"? d.maxJumlah : 0},
					  function(d){ return d;})) + (addtop- atom == 'perday'? 5 : 5);
	maxnegatif = d3.max(orientasi.map(function(d){ return d.key == "negatif"? d.maxJumlah : 0},
					  function(d){ return d;})) + addtop;
	maxnonopini = d3.max(orientasi.map(function(d){ return d.key == "nonopini"? d.maxJumlah : 0},
					  function(d){ return d;})) + addtop;
	
	
	maxdate = d3.max(orientasi, function(d) { return d.values[d.values.length - 1].date; });
	mindate = d3.min(orientasi, function(d) { return d.values[0].date; });
	
	y.domain([0,maxValue]);
	yContext.domain(y.domain());
	maxYcurrent = maxValue;
	//console.log("maxYcurrent :"+maxYcurrent);
	
	if(update){
		changeAtom(orientasi,data);
	}else{
		initDrawLine(orientasi,data,mindate,maxdate);
	}
});

}

function initDrawLine(datasetline,datasetcircle,date1,date2){
	x.domain([ date1 , date2 ]);
	xContext.domain(x.domain());
	
	linesvg.selectAll(".theLine")
      .data(datasetline)
    .enter().append("svg:g")
      .attr("class", "symbol"); 

  contextsvg.selectAll(".theContext")
		.data(datasetline)
	.enter().append("svg:g")
		.attr("class", "context");
		
  circsvg.selectAll(".theCircle")
		.data(datasetcircle)
	.enter().append("svg:g")
		.attr("class","points");
		
  contextsvg.append("g")
	      .attr("class", "x brush")
	      .call(brush)
	    .selectAll("rect")
	      .attr("y", -6)
	      .attr("height", h2 -13);

	//console.log("xdomain", x.domain());

  base();
  drawLineChart();
  //circles();	
}

function changeAtom(datasetline,datasetcircle){
	resetViewControls();
	var dd1 = $("#dates1 option:selected").val()+" 00";
	var dd2 = $("#dates2 option:selected").val()+" 23";
	var passDomain = [dd1, dd2];
	x.domain(passingDomain(passDomain,false));
	xContext.domain(x.domain());
	
	linesvg.selectAll(".symbol").remove();
	contextsvg.selectAll(".context").remove();
	circsvg.selectAll(".points").remove();
	
	linesvg.selectAll(".theLine")
      .data(datasetline)
    .enter().append("svg:g")
      .attr("class", "symbol"); 

  	contextsvg.selectAll(".theContext")
		.data(datasetline)
	.enter().append("svg:g")
		.attr("class", "context");
		
  	circsvg.selectAll(".theCircle")
		.data(datasetcircle)
	.enter().append("svg:g")
		.attr("class","points");
  
  drawLineChart();
 
  /*
  
  */
}



function base() {
	backsvg.append("svg:g")
		.attr("class","xAxis textUnselectable")
		.attr("transform", "translate(0," + h+ ")")
		.call(xAxis);
		
	backsvg.append("svg:g")
		.attr("class","yAxis textUnselectable")
		.call(yAxis.orient("left"));
		
		contextbacksvg.append("svg:g")
			.attr("class","xContextAxis textUnselectable")
			.attr("transform", "translate(0," + (h2-20)+ ")")
			.call(xAxisContext);
		
		
}


function drawLineChart() {
  
  //var = maincontextsvg.selectAll
  
  
  var g = linesvg.selectAll(".symbol")
		.attr("clip-path", "url(#clip)");
		
      //.attr("transform", "translate(0," + 100 + ")");
	
		//console.log(g);
  g.each(function(d) {
    var e = d3.select(this);

    e.append("svg:path")
    //.attr("filter","url(#dropshadow)")
	.attr("class", "line")
		.attr("id", function(d){
		  var ids = 'line_'+d.key;
		  return ids;
		})
		.attr("d", function(d) { 
			return line(d.values); })
		.style("stroke-width", "1px")
		.style("stroke", function(d) {
			return clor(d.key); });
  });

 var cx = contextsvg.selectAll(".context")
			.attr("clip-path", "url(#clip)")
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

	
	      

var c = circsvg.selectAll(".points")
	    .attr("clip-path", "url(#clip)");
  
  c.each(function(d){
    var e = d3.select(this);
    e.append("svg:circle")
    .attr("r", circlesize() )
    .attr("id", function(d){
		  var ids = 'circ_'+d.orientasi;
		  return ids;
		})
    .attr("class", "apoint bringfront")
      .style("fill", function(d){ return clor(d.orientasi);})
    .attr("stroke",function(d){ return clor(d.orientasi);})
    .attr("stroke-width", "0px")
    .attr("cx" , function(d){ return x(d.date);})
    .attr("cy" , function(d){ return y(d.jumlah);})
		.style("opacity", "0")
	    .on("mouseover.circles", function(d){
	    	var element = this;
			d3.select(this).attr("stroke-width","8px");		
			})
		.on("click.circles",function(d){
			setInfoCircle(d.date, d.jumlah, d.orientasi, currentAtom);
			var element = this;
						if(currentAtom=='perday'){
							requestKeyWords = getKeywUrl +"?tg="+(d.tgl+"%2000")+"&or="+d.orientasi+"&full=n&track=no";
							d3.text(requestKeyWords, function(keys){
								keyWords = keys;
								$(element).tooltip({
									title: keyWords,
									delay: {show: 0,hide: 1000}
								});
								reqTweet = getTweetUrl +"?tg="+d.tgl+"&or="+d.orientasi+"&atom="+currentAtom+"&rc="+d.jumlah+"&kw="+keyWords+",";
					
									$(element).tooltip('show');
									$("#fullkeyword").text(keyWords);
									console.log("getKw: "+requestKeyWords);
									console.log("getTw: "+reqTweet);
									$("#tweetcontainer").html("<h1> LOADING</h1>").load(reqTweet);
							});
						}else{
							requestKeyWords = getKeywUrl +"?tg="+(d.tgl)+"&or="+d.orientasi+"&full=n&track=no";
							d3.text(requestKeyWords, function(keys){
								keyWords = keys;
								$(element).tooltip({
									title: keyWords,
									delay: {show: 0,hide: 1000}
								});
								reqTweet = getTweetUrl +"?tg="+(d.tgl.replace(" ","%20"))+"&or="+d.orientasi+"&atom="+currentAtom+"&rc="+d.jumlah+"&kw="+keyWords+",";	
									$(element).tooltip('show');
									$("#fullkeyword").text(keyWords);
									//console.log("getKw: "+requestKeyWords);
									console.log("getTw: "+reqTweet);
									$("#tweetcontainer").html("<h1> LOADING</h1>").load(reqTweet);
							});
						}
						
					
					
			/*buggy
			d3.select(this)
				.attr("r", (circlesize()+5))
				.transition().duration(duration[2])
				.attr("r",circlesize());
			*/	
		})
		.on("mouseout.circles", function(d){
			d3.select(this).attr("stroke-width","0px");
		});
    
  });
  
   contextbacksvg.select(".xContextAxis").call(xAxisContext);
  backsvg.select(".xAxis").call(xAxis);
  backsvg.select(".yAxis").call(yAxis);
  $("#loading").css("display","none");
}

function redraw(chartsize){
  
  var currentDomain = brush.empty() ? xContext.domain() : brush.extent();
  
  if(chartsize==null){
    chartsize = selisih(
		currentDomain
		);	
  }
  
  x.domain(currentDomain);
  y.domain([0, maxYcurrent]);
  
  //console.log("circ "+circlesize(chartsize));
  //console.log("line "+linewidth(chartsize));
  var recirc = circsvg.selectAll(".theCircles circle");
	recirc.each(function(d){
	    var e = d3.select(this);
	    e.attr("cx" , function(d){ return x(d.date);})
	    .attr("cy" , function(d){ return y(d.jumlah);})
	    .attr("r" , circlesize(chartsize));
	});
	
  var reline = linesvg.selectAll(".theLines path");
	reline.each(function(d){
		var e = d3.select(this);
		e.attr("d",line(d.values))
		.style("stroke-width", linewidth(chartsize));
	});
   var recontext = contextsvg.selectAll(".theContexts path");
	recontext.each(function(d){
		var e = d3.select(this);
		e.attr("d", line2(d.values));
		
	})
  
  contextbacksvg.select(".xContextAxis").call(xAxisContext);
  backsvg.select(".xAxis").call(xAxis);
  backsvg.select(".yAxis").call(yAxis);
}


function circlesize(chartsize){
    
    if (chartsize >= 11 && chartsize <= 15) {
      return 3;
    }else if(chartsize >= 5 && chartsize <= 10) {
      return 4; 
    }else if(chartsize >= 0 && chartsize <= 4){
      return 5;
    }else{
      return 2; //default circlesize;
    }
}

function linewidth(chartsize){
    if (chartsize >= 11 && chartsize <= 15) {
      return "2px";
    }else if(chartsize >= 5 && chartsize <= 10) {
      return "2.5px"; 
    }else if(chartsize >= 0 && chartsize <= 4){
      return "3px";
    }else{
      return 1;
    }
}

function unzoom(){
	brush.clear();
	redraw();
}

function toggleLine(orient){
	
  var elementName = "#line_"+orient;
  var isBlock ="";
  getDisplay = $(elementName).css("display");
  if (getDisplay == "block" || getDisplay == "inline"){
  	hideline(orient);
  }else if(getDisplay == "none"){
  	showline(orient);
  }
  redraw();
}

function toggleMaxY(ornt){
	switch(ornt){
		case "positif":
			maxYcurrent = maxpositif;
		break;
		case "negatif":
			maxYcurrent = maxnegatif;
		break;
		case "nonopini":
			maxYcurrent = maxnonopini;
		break;
		case "default":
			maxYcurrent = maxValue;
		break;
	}
	
	redraw();
}

function hideline(ornt) {
	var selectedline = '#line_'+ornt;
	var selectedcirc = '#circ_'+ornt;
	
	var reline = linesvg.select(selectedline);
	var recirc = circsvg.selectAll(selectedcirc);
	reline
	.transition().duration(500)
	.style("display","none");
	
	recirc
	.transition().duration(500)
	.style("display","none");
}

function showline(ornt) {
	var selectedline = '#line_'+ornt;
	var selectedcirc = '#circ_'+ornt;
	
	var reline = linesvg.select(selectedline);
	var recirc = circsvg.selectAll(selectedcirc);
	
	reline
	.transition().duration(500)
	.style("display","block");
	
	recirc
	.transition().duration(500)
	.style("display","block");
	
}
	
function circopacity(opacity){
	return function(d){
		
	var recirc = circsvg.selectAll(".apoint");
	recirc
			.transition().duration(duration[3])
			.style("opacity",opacity);
	}
	
}

function passingDomain(passDomain, fromSlider){
	var dd1 = parseJam(passDomain[0]);
	var dd2 = parseJam(passDomain[1]);
	if(dd1.getDate()==mindate.getDate()){
		dd1 = mindate;
	};
	if(dd2.getDate()==maxdate.getDate()){
		dd2 = maxdate;	
	};
	var newDomain = [dd1, dd2];
	
	if(fromSlider){
	x.domain(newDomain);
	xContext.domain(newDomain);
	redraw(
	       selisih(newDomain)
	       );
	}else{
		return newDomain;
	}
}

function selisih(dates){
	return Math.ceil(
			 (dates[1] - dates[0])/(1000*60*60*24)
			 );
}

function keywordbubbles(key){

	var request = "data/getKeyword.php?track=yes&key="+key;
	console.log(request);
	d3.json(request, function(data){
		
		
		data.forEach(function(d){
			d.tanggal = parseTanggal(d.tanggal);
			d.jumlah = +d.jumlah;
		});
		var maxJum = d3.max(data.map(function(d){ return d.jumlah}),function(d){ return d;});
		//console.log(d3.max(data.map(function(d){ return d.jumlah}),function(d){ return d;}));
		bubbleScale.domain([0, maxJum ]);
		//console.log(data);
		
		
		
		bubbles = bubblesground.selectAll(".keywordcirc")
				.data(data).enter().append("svg:g")
				.attr("clip-path", "url(#clip)");	
		
		bubbles.append("svg:ellipse")
		    .attr("ry", function(d){
		    	console.log(d.jumlah+" : "+bubbleScale(d.jumlah)); 
		    	return bubbleScale(d.jumlah);
		    	})
		    .attr("rx", function(d){
		    	var rx = bubbleScale(d.jumlah)-(bubbleScale(d.jumlah) * 0.20); 
		    	return rx;
		    })
		    .attr("class", "onebubble")
		      .style("fill", "#EEEEEE")
		      .style("fill-opacity","0.2")
		    .attr("stroke","#ddd")
		    .attr("stroke-opacity","0.3")
		    .attr("stroke-width", "1px")
		    .attr("cx" , function(d){
		    	return x(d.tanggal);	
		    	})
		    .attr("cy" , h/2)
		    .on("mouseover.ellipse",function(d,i){
		    	var textDom = "#bubbletext_"+i;
		    	$(textDom).slideToggle(100);
		    	d3.select(this).attr("stroke-opacity","1");
		    })
		    .on("mouseout.ellipse",function(d,i){
		    	var textDom = "#bubbletext_"+i;
		    	$(textDom).slideToggle(100);

		    	d3.select(this).attr("stroke-opacity","0.3");
		    });
		
	    bubbles.append("text")
	    	   .text(function(d){
	    			return d.jumlah;
	    		})
	      .attr("class","hide")
	      .attr("id",function(d,i){
	      	return "bubbletext_"+i;
	      })
	      .attr("x", function(d){
		    	return x(d.tanggal);	
		    	}) 
		  .attr("y", h/2)
		  .attr("dx", 0) 
		  .attr("dy", ".15em")
		  .attr("text-anchor", "middle")
		  .attr("fill", "#000")
		  .style("font", "8pt Helvetica");
		
	});
	
return null;   
}


