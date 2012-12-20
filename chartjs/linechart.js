var linechart = new vizconfig();
    linechart.margin = [20, 35, 40, 50, 60];
    linechart.width = $("#linecontainer").width() - ($("#miscinfo").width()+30);
    linechart.height = 300;
    linechart.xScale = d3.time.scale().range([0, linechart.width - linechart.margin[4]]);
    linechart.yScale = d3.scale.linear().range([linechart.height, 0]);
    linechart.loading = function(command) {
                            if(command){
                                $('#loading').css('display', 'block');  
                            }else{
                                $('#loading').css('display', 'none');
                            }
                         };
    linechart.xAxis = d3.svg.axis()
                        .scale(linechart.xScale)
                        .tickSize(-linechart.height)
                        .tickPadding(10)
                        .tickSubdivide(true);
    linechart.yAxis = d3.svg.axis()
                        .scale(linechart.yScale)
                        .tickSize(-linechart.width + linechart.margin[4])
                        .ticks(5);
    
var contextchart = new vizconfig();
    contextchart.width = linechart.width;
    contextchart.height = 50 + linechart.margin[0];
    contextchart.xScale = d3.time.scale()
                            .range([0, linechart.width - linechart.margin[4]]);
    contextchart.yScale = d3.scale.linear()
                            .range([contextchart.height, 0]);
    contextchart.xAxis = d3.svg.axis()
                              .scale(contextchart.xScale)
                              .tickSize(-contextchart.height)
                              .tickPadding(10)
                              .ticks(8)
                              .ticks(d3.time.days).tickFormat(d3.time.format('%d/%b'));
    contextchart.yAxis = d3.svg.axis()
                              .scale(contextchart.yScale)
                              .tickSize(-linechart.width + linechart.margin[4])
                              .ticks(2);
                              
var barchart = new vizconfig();
    barchart.margin = [5, 10, 20, 25];
    barchart.width = 215 ;
    barchart.height = 70;
    barchart.xScale = d3.scale.linear().range([0, (barchart.width-barchart.margin[2])]);
    barchart.yScale = d3.scale.ordinal().rangeRoundBands([0, barchart.height], .1);
    barchart.xAxis = d3.svg.axis().scale(barchart.xScale).tickSubdivide(true).orient('top').tickSize(-barchart.height).tickValues([5000, 15000]);

var allsvg = d3.select('#linechart').append('svg:svg')
		.attr('class', 'view')
	    .attr('width', linechart.width)
	    .attr('height', linechart.height + linechart.margin[0] + linechart.margin[2])
	    .on('mouseover.chart', circopacity(1))
	    .on('mouseout.chart', circopacity(0));


    
    
var allbg = allsvg.append('rect')
	  .attr('width', linechart.width - linechart.margin[4])
	  .attr('height', linechart.height)
	  .attr('transform', gc.translate(linechart.margin[1],1))
	  .attr('fill', '#fff')
	  .style('stroke', 'none');



    //!!!!IMPORTANT, Clipping path supaya ga melebihi axis
    //(Setelah diset disini, diset lagi attr("clip-path", "url(#clip)") di elemen yang mau diisi pathnya
   allsvg.append('defs').append('clipPath')
           .attr('id', 'clip')
	       .append('rect')
	       .attr('width', linechart.width - linechart.margin[4])
	       .attr('height', linechart.height);

//FILTER BLUR
var defs = allsvg.select('defs');
var filters = defs.append('filter').attr('id', 'blurify');

	filters.append('feGaussianBlur').attr('stdDeviation', gc.blurEffect);
	//filters.append("feOffset").attr("dx",1).attr("dy",1).attr("result","offsetblur");
	//filters.append("feBlend").attr("in","SourceGraphic").attr("mode","normal");

var keywordground = allsvg.append('svg:g')
      .attr('class', 'theKeywordBG')
      .attr('fill', '#fff')
      .style('stroke', 'none')
      .attr('clip-path', 'url(#clip)');

var contsvg = d3.select('#context').append('svg:svg')
	      .attr('width', contextchart.width)
	      .attr('height', contextchart.height);

var contbg = contsvg.append('rect')
      .attr('class', 'edges')
      .attr('width', contextchart.width - linechart.margin[4])
      .attr('height', (contextchart.height - linechart.margin[0]))
      .attr('transform', gc.translate(linechart.margin[2],0))
      .attr('fill', '#fff')
      .style('stroke-width', '1px');

var backsvg = allsvg.append('svg:g')
	      .attr('class', 'theAxis')
	      .attr('transform', gc.translate(linechart.margin[2],0));

var contextbacksvg = contsvg.append('svg:g')
		     .attr('class', 'contAxis')
		     .attr('transform', gc.translate(linechart.margin[2],0));

var linesvg = allsvg.append('svg:g')
	    .attr('class', 'theLines')
	    .attr('transform', gc.translate(linechart.margin[2],0));

var circsvg = allsvg.append('svg:g')
	     .attr('class', 'theCircles')
	     .attr('transform', gc.translate(linechart.margin[2],0));

var contextsvg = contsvg.append('svg:g')
		 .attr('class', 'theContexts')
		 .attr('transform', gc.translate(linechart.margin[2],0));

var edges = allsvg.append('rect')
      .attr('class', 'edges')
	  .attr('width', linechart.width - linechart.margin[4])
	  .attr('height', linechart.height)
	  .attr('transform', gc.translate(linechart.margin[2],1))
	  .attr('fill', 'none')
	  .style('stroke-width', '2.5px');





var loadingbar = allsvg.append('svg:g')
			.attr('id', 'loading')
			.style('display', 'none');

    loadingbar.append('rect')
		.attr('transform', gc.translate(linechart.margin[2],1))
    	.attr('class', 'load')
    	.attr('fill', '#ddd')
    	.style('opacity', '0.7')
    	.attr('width', linechart.width - linechart.margin[4])
	    .attr('height', linechart.height);

    linechart.progress =  loadingbar.append('text')
		  .attr('x', (linechart.width / 2 - linechart.margin[4]))
		  .attr('y', (linechart.height / 2))
		  .attr('dx', 0)
		  .attr('dy', '.15em')
		  .attr('text-anchor', 'start')
		  .attr('fill', '#000')
		  .style('font', '20pt Arial')
		  .style('text-shadow', '2px 2px 2px rgba(0,0,0,.3)');
		  
    linechart.progress.text(gc.progressInfo[12]);


var line = d3.svg.line()
	  .interpolate('linear')
	  .x(function(d) { return linechart.xScale(d.date); })
	  .y(function(d) { return linechart.yScale(d.jumlah); });

var line2 = d3.svg.line()
	    .interpolate('bundle')
	    .x(function(d) { return contextchart.xScale(d.date);})
	    .y(function(d) { return contextchart.yScale(d.jumlah)});

var axis = d3.svg.line()
	  .interpolate('basis')
	  .x(function(d) { return linechart.xScale(d.date); })
	  .y(linechart.height);

var brush = d3.svg.brush()
	  .x(contextchart.xScale)
	  .on('brush', redraw);

function resetViewControls() {
 		  	for (i = 0; i < gc.tog.length; i++) {
     		  		gc.tog[i].view = true;
     		  		$(gc.tog[i].eye).attr('class', 'icon-eye-open');
 		  	    }
 		  		$('#viewcontrols button').attr('class', 'btn btn-mini');
 		  		$('#viewcontrols button').removeAttr('disabled');
}
 		  
function saddtop(maxY) {
	if (maxY < 50) {
		maxY = maxY + 10;
	}else if (maxY > 500) {
		maxY = maxY + 20;
	}else if (maxY > 1000) {
		maxY = maxY + 100;
	}
	return maxY;
}

function initLineChart(unit,update) {
	linechart.loading(true);
	
    $("#infoSatuanWaktu").text(unit == 'perday' ? 'Hari' : 'Jam');
    
	gc.timeUnit = unit;
    
d3.csv( gc.getLineUrl+'?unit='+unit , function(data) {

  data.forEach(function(d,i) {
  	  d.tgl = d.date;
	  d.date = gc.timeUnit == 'perday' ? gc.parseJam(d.date + ' 12') : gc.parseJam(d.date);
	  d.jumlah = +d.jumlah;
  });

  orientasi = d3.nest()
      .key(function(d) {
		return d.orientasi; })
      .entries(data);

  orientasi.forEach(function(d) {
    d.maxJumlah = d3.max(d.values, function(d) { return d.jumlah; });
    d.sumJumlah = d3.sum(d.values, function(d) { return d.jumlah; });
  });
  
	linechart.maxValue = d3.max(orientasi.map(function(d) { return d.maxJumlah}),
			                 function(d) { return d;}) + gc.addtop();
	linechart.maxpositif = d3.max(orientasi.map(function(d) { return d.key == 'positif'? d.maxJumlah : 0},
					           function(d) { return d;})) + (gc.addtop() - gc.timeUnit == 'perday' ? 5 : 5);
	linechart.maxnegatif = d3.max(orientasi.map(function(d) { return d.key == 'negatif'? d.maxJumlah : 0},
					           function(d) { return d;})) + gc.addtop();
	linechart.maxnonopini = d3.max(orientasi.map(function(d) { return d.key == 'nonopini'? d.maxJumlah : 0},
					               function(d) { return d;})) + gc.addtop();
					               

	linechart.yScale.domain([0, linechart.maxValue]);
	contextchart.yScale.domain(linechart.yScale.domain());
	linechart.maxYcurrent = linechart.maxValue;

	if (update) {
		changeAtom(orientasi, data);
	}else {
		initDrawLine(orientasi, data, gc.firstDate, gc.lastDate);
	}
});

}

function initDrawLine(datasetline,datasetcircle,date1,date2) {
	linechart.xScale.domain([date1, date2]);
	contextchart.xScale.domain(linechart.xScale.domain());

  linesvg.selectAll('.theLine')
      .data(datasetline)
    .enter().append('svg:g')
      .attr('class', 'symbol');

  contextsvg.selectAll('.theContext')
		.data(datasetline)
	.enter().append('svg:g')
		.attr('class', 'context');

  circsvg.selectAll('.theCircle')
		.data(datasetcircle)
	.enter().append('svg:g')
		.attr('class', 'points');

  contextsvg.append('g')
	      .attr('class', 'x brush')
	      .call(brush)
	    .selectAll('rect')
	      .attr('y', -6)
	      .attr('height', contextchart.height - 13);


  base();
  drawLineChart();
  //circles();
}

function base() {
    backsvg.append('svg:g')
        .attr('class', 'xAxis textUnselectable')
        .attr('transform', gc.translate(0,linechart.height))
        .call(linechart.xAxis);

    backsvg.append('svg:g')
        .attr('class', 'yAxis textUnselectable')
        .call(linechart.yAxis.orient('left'));

    contextbacksvg.append('svg:g')
            .attr('class', 'xContextAxis textUnselectable')
            .attr('transform', gc.translate(0, (contextchart.height - 20)))
            .call(contextchart.xAxis);
}


function changeAtom(datasetline,datasetcircle) {
    
	resetViewControls();
	
	//Updating domain
	if (gc.defaultUbahRentang == '#rentangdatepicker') {
		if ($('#calDate1').val() == '') {
			var dd1 = gc.strFirstDate + ' 00';
			var dd2 = gc.strLastDate + ' 23';
		}else {
			var dd1 = $('#calDate1').val() + ' 00';
			var dd2 = $('#calDate2').val() + ' 23';
		}
		var passDomain = [dd1, dd2];
	}else {
		var dd1 = $('#dates1 option:selected').val() + ' 00';
		var dd2 = $('#dates2 option:selected').val() + ' 23';
		var passDomain = [dd1, dd2];
	}
	linechart.xScale.domain(setDomain(passDomain, false));
	contextchart.xScale.domain(linechart.xScale.domain());

    //Removing elements
	linesvg.selectAll('.symbol').remove();
	contextsvg.selectAll('.context').remove();
	circsvg.selectAll('.points').remove();
    
    //Updating data-join to elements
	linesvg.selectAll('.theLine')
      .data(datasetline)
    .enter().append('svg:g')
      .attr('class', 'symbol');

  	contextsvg.selectAll('.theContext')
		.data(datasetline)
	.enter().append('svg:g')
		.attr('class', 'context');

  	circsvg.selectAll('.theCircle')
		.data(datasetcircle)
	.enter().append('svg:g')
		.attr('class', 'points');
  
  //Removing keywordchart
  if (keywordchart.rects != null) {
  	     resetbgkeyword();
    }
      
    drawLineChart();

}

function drawLineChart() {

  //var = maincontextsvg.selectAll

  var g = linesvg.selectAll('.symbol')
		.attr('clip-path', 'url(#clip)');

  g.each(function(d) {
  
  var e = d3.select(this);

    e.append('svg:path')
		.attr('class', function(d) {
		  var ids = 'line_' + d.key;
		  return ids;
		})
		.attr('d', function(d) {
			return line(d.values); })
		.style('stroke-width', '1px')
		.style('stroke', function(d) {
			return gc.colorOrientasi(d.key); })
		.style('fill', 'none');
  });

 var cx = contextsvg.selectAll('.context')
			.attr('clip-path', 'url(#clip)')
			.attr('transform', gc.translate(0,-20));

  cx.each(function(d) {
  
  var e = d3.select(this);

    e.append('svg:path')
	.attr('class', 'linecontext')
		.attr('d', function(d) {
			return line2(d.values); })
		.style('stroke', function(d) {
			return gc.colorOrientasi(d.key); })
		.style('opacity', '0')
		.transition().duration(gc.duration[2]).delay(gc.delay[1])
		.style('opacity', '1');
  });




var c = circsvg.selectAll('.points')
	    .attr('clip-path', 'url(#clip)');

  c.each(function(d) {
  	if (d.orientasi == 'negatif' && d.date.getDate() == 13) {
  	        d.date.setDate(12);
  	}
    var e = d3.select(this);
    e.append('svg:circle')
    .attr('r', circlesize())
    .attr('id', function(d) {
		  var ids = 'circ' + d.orientasi + ''+ d.date.getDate() + '_'+ d.date.getHours();
		  return ids;
		})
    .attr('class', function(d,i) {
          var ids = 'circ_' + d.orientasi + ' apoint';
          return ids;
        })
      .style('fill', function(d) { return gc.colorOrientasi(d.orientasi);})
    .attr('stroke', function(d) { return gc.colorOrientasi(d.orientasi);})
    .attr('stroke-width', '0px')
    .attr('cx' , function(d) { return linechart.xScale(d.date);})
    .attr('cy' , function(d) { return linechart.yScale(d.jumlah);})
		.style('opacity', '0')
	    .on('mouseover.circles', function(d) {
			var change = d3.select(this);
			change.attr('stroke-width', '8px');
			})
		.on('click.circles', function(d) {
		    clickCircle(d, this);
		   })
		.on('mouseout.circles', function(d) {
			var change = d3.select(this);
			change.attr('stroke-width', '2px');
		});

  });

  contextbacksvg.select('.xContextAxis').call(contextchart.xAxis);
  backsvg.select('.xAxis').call(linechart.xAxis);
  backsvg.select('.yAxis').call(linechart.yAxis);
  linechart.loading(false);
}

function clickCircle(d, element){
    var requestKeyWords, reqTweet, keyWords;
            //Update Info Circle
            setInfoCircle(d.date, d.jumlah, d.orientasi, gc.timeUnit, element.id);
                        
                        //Get & Set Tooltip buat info keyword
                        if (gc.timeUnit == 'perday') {
                            requestKeyWords = gc.getKeywUrl + '?tg='+ (d.tgl + '%2000') + '&or='+ d.orientasi + '&full=n&track=no';
                            d3.text(requestKeyWords, function(keys) {
                                keyWords = keys;
                                $(element).tooltip({
                                    title: keyWords,
                                    delay: {show: 0, hide: 1000}
                                });
                                reqTweet = gc.getTweetUrl + '?tg='+ d.tgl + '&or='+ d.orientasi + '&atom='+ gc.timeUnit + '&kw='+ keyWords + ',';
                                    $(element).tooltip('show');
                                    $('#fullkeyword').text(keyWords);
                                    $('#tweetcontainer').html("<img id='loadingtweet' src='img/black-010-loading.gif'/>").load(reqTweet);
                            });
                        }else {
                            requestKeyWords = gc.getKeywUrl + '?tg='+ (d.tgl) + '&or='+ d.orientasi + '&full=n&track=no';
                            d3.text(requestKeyWords, function(keys) {
                                keyWords = keys;
                                $(element).tooltip({
                                    title: keyWords,
                                    delay: {show: 0, hide: 1000}
                                });
                                reqTweet = gc.getTweetUrl + '?tg='+ (d.tgl.replace(' ', '%20')) + '&or='+ d.orientasi + '&atom='+ gc.timeUnit + '&rc='+ d.jumlah + '&kw='+ keyWords + ',';
                                    $(element).tooltip('show');
                                    $('#fullkeyword').text(keyWords);
                                    $('#tweetcontainer').html("<img id='loadingtweet' src='img/black-010-loading.gif'/>").load(reqTweet);
                            });
                        }
            //
            d3.select(element).attr('stroke', '#6283ff')
                                .attr('stroke-width', '1px');
                                console.log(element.id);
        return true;
}

function redraw(chartsize) {

  var currentDomain = brush.empty() ? contextchart.xScale.domain() : brush.extent();
    
  
  if (chartsize == null) {
    chartsize = selisih(currentDomain);
  }

  linechart.xScale.domain(currentDomain);
  linechart.yScale.domain([0, linechart.maxYcurrent]);

  //console.log("circ "+circlesize(chartsize));
  //console.log("line "+linewidth(chartsize));
  var recirc = circsvg.selectAll('.theCircles circle');
	recirc.each(function(d) {
	    var e = d3.select(this);
	    e.attr('cx' , function(d) { return linechart.xScale(d.date);})
	    .attr('cy' , function(d) { return linechart.yScale(d.jumlah);})
	    .attr('r' , circlesize(chartsize));
	});

  var reline = linesvg.selectAll('.theLines path');
	reline.each(function(d) {
		var e = d3.select(this);
		e.attr('d', line(d.values))
		.style('stroke-width', linewidth(chartsize));
	});
   var recontext = contextsvg.selectAll('.theContexts path');
	recontext.each(function(d) {
		var e = d3.select(this);
		e.attr('d', line2(d.values));

	});

  contextbacksvg.select('.xContextAxis').call(contextchart.xAxis);
  backsvg.select('.xAxis').call(linechart.xAxis);
  backsvg.select('.yAxis').call(linechart.yAxis);
  if (!isKeywordEmpty()) {
  	resetbgkeyword();
  	drawbgkeyword();
  }
  
}



function circlesize(chartsize) {

    if (chartsize >= 11 && chartsize <= 15) {
      return 3;
    }else if (chartsize >= 5 && chartsize <= 10) {
      return 4;
    }else if (chartsize >= 0 && chartsize <= 4) {
      return 5;
    }else {
      return 2; //default circlesize;
    }
}

function linewidth(chartsize) {
    if (chartsize >= 11 && chartsize <= 15) {
      return '2px';
    }else if (chartsize >= 5 && chartsize <= 10) {
      return '2.5px';
    }else if (chartsize >= 0 && chartsize <= 4) {
      return '3px';
    }else {
      return 1;
    }
}

function unzoom() {
	brush.clear();
	redraw();
}

function toggleLine(ornt) {

  var elementName = '.line_'+ ornt;
  var isBlock = '';
  getDisplay = $(elementName).css('display');
  if (getDisplay == 'block' || getDisplay == 'inline') {
  	hideline(ornt);
  }else if (getDisplay == 'none') {
  	showline(ornt);
  }
  redraw();
}

function toggleMaxY(ornt) {
	switch (ornt) {
		case 'positif':
			linechart.maxYcurrent = linechart.maxpositif;
		break;
		case 'negatif':
			linechart.maxYcurrent = linechart.maxnegatif;
		break;
		case 'nonopini':
			linechart.maxYcurrent = linechart.maxnonopini;
		break;
		case 'default':
			linechart.maxYcurrent = linechart.maxValue;
		break;
	}
	redraw();
}

function hideline(ornt) {
	var selectedline = '.line_' + ornt;
	var selectedcirc = '.circ_' + ornt;

	var reline = linesvg.select(selectedline);
	var recirc = circsvg.selectAll(selectedcirc);
	reline
	.transition().duration(gc.duration[2])
	.style('display', 'none');

	recirc
	.transition().duration(gc.duration[2])
	.style('display', 'none');
}

function showline(ornt) {
	var selectedline = '.line_' + ornt;
	var selectedcirc = '.circ_' + ornt;

	var reline = linesvg.select(selectedline);
	var recirc = circsvg.selectAll(selectedcirc);

	reline
	.transition().duration(gc.duration[2])
	.style('display', 'block');

	recirc
	.transition().duration(gc.duration[2])
	.style('display', 'block');

}

function circopacity(opacity) {
	return function(d) {

	var recirc = circsvg.selectAll('.apoint');
	recirc
			.transition().duration(gc.duration[3])
			.style('opacity', opacity);
	}

}

function setDomain(passDomain, fromSlider) {
	var dd1 = gc.parseJam(passDomain[0]);
	var dd2 = gc.parseJam(passDomain[1]);
	
	if (dd1.getDate() == gc.firstDate.getDate()) {
		dd1 = gc.firstDate;
	}
	if (dd2.getDate() == gc.lastDate.getDate()) {
		dd2 = gc.lastDate;
	}
	var newDomain = [dd1, dd2];

	if (fromSlider) {
	linechart.xScale.domain(newDomain);
	contextchart.xScale.domain(newDomain);
	redraw(selisih(newDomain));
	}else {
		return newDomain;
	}
}

function selisih(dates) {
	return Math.ceil(
			 (dates[1] - dates[0]) / (1000 * 60 * 60 * 24)
			 );
}

