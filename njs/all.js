//Init global properties 

(function(){
        //override array hari untuk axis x
        d3_time_weekdays = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
        
        //gc (Global Config) Properties & Tools
        var gc = {
            timeUnit: 'perday',//default time unit
            toggleTimeUnit: function(unit) { 
                    if(this.timeUnit!=unit){
                        if(unit=='perday' || unit=='perhour'){
                            this.timeUnit = unit;
                        }else{
                            var msg = 'Error toggleAtom. Param atom:'+atom+' instead of perday/perhour';
                            gc.infoError(msg, false);
                        }
                    }
                },
            defaultUbahRentang: '#datepick',
            domainOrientasi: ['negatif', 'positif', 'nonopini'],
            colorOrientasi: d3.scale.ordinal().range(['#FF0000', '#009900', '#FAA732']),
            parseJam: d3.time.format('%Y-%m-%d %H').parse,
            parseTanggal: d3.time.format('%Y-%m-%d').parse,
            addtop: function(){ return gc.timeUnit == 'perday' ? 100 : 10;},
            //addtop penambahan supaya line tidak menyentuh pojok atas chart
            nama_bulan : ["0","Januari", "Februari", "Maret", 
                "April", "Mei", "Juni", "Juli", "Agustus", "September", 
                "Oktober", "November", "Desember"],
            duration: [100, 200, 500, 1000, 1500], 
            delay: [100,500, 1000],
            getTweetUrl: 'data/getTweets.php',
            getKeywUrl: 'data/getKeyword.php',
            getBarUrl: 'data/barchartjson.php',
            getDateListUrl: 'data/datelist.php',
            getPieData: 'data/getKeyword.php?track=count',
            getLineUrl: 'data/linecsv.php',
            format: d3.format(',.0f'),
            blurEffect: 15,
            translate: function(horizontal, vertical){
                return 'translate('+horizontal+','+vertical+')';
                },
            orderArray: function(T){
                return [T[0], T[2], T[1]];
                },
            dateList: 0,
            dateSize: 0,
            firstDate: 0,
            lastDate: 0,
            rentangFirstDate: 0,
            rentangLastDate: 0,
            strFirstDate: "",
            strLastDate: "",
            tog : [ { orn: "negatif",eye: "#negeye", id: "#toggleNegatif", view : true},
                    { orn: "positif",eye: "#poseye", id: "#togglePositif", view : true},
                    { orn: "nonopini",eye: "#noneye", id: "#toggleNonopini", view : true} ],
            infoError: function(msg, isAlert){
                if(isAlert){
                    alert(msg);
                    return true;
                }else{
                    console.log(msg);
                    return true;
                }
            },
            progressInfo: ['Failed to load!', '10%..','20%..','30%..','40%..','50%..',
                            '60%..','70%..','80%..','90%..','100%','Complete.','Please Wait...'],
            rentangHide: false,
            format: d3.format(',.0f'),
            formatPercent: d3.format(".0%"),
            perdayTips: [],
            perhourTips: [],
            isPerdayTipsExist: false,
            isPerhourTipsExist: false,
            circleTipHideDelay: 3.5,
            totalNegatif: 0,
            totalPositif: 0,
            totalNonopini: 0,
            jsondataset: 0,
            jsonbigneg: 0,
            jsonbigpos: 0,
            jsonbignon: 0,
            loadingGIF: '<img src=\'img/black-020-loading.gif\'/>'
        };
        
        
        //load json peringkat keyword
        queue().defer(d3.json, 'http://localhost/vis/data/getKeyword.php?track=big&or=dataset')
                .defer(d3.json, 'http://localhost/vis/data/getKeyword.php?track=big&or=negatifbig')
                .defer(d3.json, 'http://localhost/vis/data/getKeyword.php?track=big&or=positifbig')
                .defer(d3.json, 'http://localhost/vis/data/getKeyword.php?track=big&or=nonopinibig')
                .await(collect);
                
       function collect(error, jsons) {
                function sortdesc(ar) {
                    return ar.sort(function(a,b) {
                            return b.val - a.val;
                        });
                }
           if(error) return gc.infoError('failed getting json files', true);
           gc.jsondataset = sortdesc(jsons[0]);
           gc.jsonbigneg = sortdesc(jsons[1]);
           gc.jsonbigpos = sortdesc(jsons[2]);
           gc.jsonbignon = sortdesc(jsons[3]);
           
       } 
            
        // DatePicker range Date
        function initDatePicker(){
             $("#calDate1").datepicker("option", "minDate", gc.firstDate);
             $("#calDate1").datepicker("option", "maxDate", gc.lastDate);
             $("#calDate2").datepicker("option", "minDate", gc.firstDate);
             $("#calDate2").datepicker("option", "maxDate", gc.lastDate);
        }
        
        //Assign color scale domain 
        gc.colorOrientasi.domain(gc.domainOrientasi);
        
        function vizconfig() {
            this.width = 0;
            this.height = 0;
            this.margin = [];
            this.xScale = function(){};
            this.yScale =  function(){};
        };
        
        
            
        //export   
        window.gc = gc;
        window.vizconfig = vizconfig;
        window.initDatePicker = initDatePicker;  
})();

$(function() {
   var myPie = $("#pie");
   var pieOpentip = new Opentip(myPie, {showOn: "mouseover",
                                        showEffect: "fade",
                                        tipJoint: "bottom left",
                                        style: "glass",
                                        borderRadius: 1,
                                        escapeContent: false,
                                        borderWidth: 3,
                                        borderColor: "#317cc5",
                                        fixed: false});
   
   gc.pieTip = pieOpentip; 
   
   Opentip.styles.circ = {
       extends: 'glass',
       ajax: false,
       showOn: null,
       delay: 0.5,
       tipJoint: 'bottom left',
       target: true,
       fixed: true,
       borderWidth: 1.5,
       hideDelay: gc.circleTipHideDelay,
       group: 'circles'
   } 
});

//FULSCREEN API
(function() {
    var
        fullScreenApi = {
            supportsFullScreen: false,
            isFullScreen: function() { return false; },
            requestFullScreen: function() {},
            cancelFullScreen: function() {},
            fullScreenEventName: '',
            prefix: ''
        },
        browserPrefixes = 'webkit moz o ms khtml'.split(' ');
 
    // check for native support
    if (typeof document.cancelFullScreen != 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
            fullScreenApi.prefix = browserPrefixes[i];
 
            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
                fullScreenApi.supportsFullScreen = true;
 
                break;
            }
        }
    }
 
    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
 
        fullScreenApi.isFullScreen = function() {
            switch (this.prefix) {
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        }
        fullScreenApi.requestFullScreen = function(el) {
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        }
        fullScreenApi.cancelFullScreen = function(el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        }
    }
 
    // jQuery plugin
    if (typeof jQuery != 'undefined') {
        jQuery.fn.requestFullScreen = function() {
 
            return this.each(function() {
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.requestFullScreen(this);
                }
            });
        };
    }
 
    // export api
    window.fullScreenApi = fullScreenApi;
})();



function initjs() {
    
    
    // TODO: Kumpulin semua click listener dari jquery
    
    // List of Listeners

   /*
   * Input form search keyword
   * Listen enter keys
   */
   $('#searchkeyword').keypress(function(k) {
        if (k.which == 13) {
            var key = $('#searchkeyword').val();
            if (key != '') {
                searchkeyword(key, false);
                resultkeyword(key);
            }
        return false;
        }
    });
    /*
     * Listener for X icon in search keyword form
     */
    $('input.deletable').wrap('<span class="deleteicon" />').after($('<span/>').click(function() {
        resetbgkeyword();
        $(this).prev('input').val('').focus();
    }));
    
    /*
     * Listener for lines visibility toggles
     * Only allow two button to be disabled
     */
    $('#toggleNegatif').click(function() {
        toggleLine('negatif');
            if (gc.tog[0].view) {
                $(gc.tog[0].eye).attr('class', 'icon-eye-close');
                gc.tog[0].view = false;
            }else {
                $(gc.tog[0].eye).attr('class', 'icon-eye-open');
                gc.tog[0].view = true;
            }
        isAlone();
    });
    $('#togglePositif').click(function() {
        toggleLine('positif');
            if (gc.tog[1].view) {
                $(gc.tog[1].eye).attr('class', 'icon-eye-close');
                gc.tog[1].view = false;
            }else {
                $(gc.tog[1].eye).attr('class', 'icon-eye-open');
                gc.tog[1].view = true;
            }
        isAlone();
    });
    $('#toggleNonopini').click(function() {
        toggleLine('nonopini');
            if (gc.tog[2].view) {
                $(gc.tog[2].eye).attr('class', 'icon-eye-close');
                gc.tog[2].view = false;
            }else {
                $(gc.tog[2].eye).attr('class', 'icon-eye-open');
                gc.tog[2].view = true;
            }
        isAlone();
    });
    /*
     * Function for checking wether two button has been disabled 
     */
    function isAlone() {
        var countrue = 0;
        var alone = 0;
        for (i = 0; i < gc.tog.length; i++) {
            if (gc.tog[i].view == true) {
                countrue++;
            }
        }
        if (countrue == 1) {
            for (i = 0; i < gc.tog.length; i++) {
                if (gc.tog[i].view == true) {
                    $(gc.tog[i].id).attr('disabled', '');
                    toggleMaxY(gc.tog[i].orn);
                }
            }
        }
        if (countrue > 1) {
            $('#viewcontrols button').removeAttr('disabled');
            toggleMaxY('default');
        }
    };

    /*
     * Listener for toggling line context visibility
     */
    $('#zoombutton').click(function() {
        var msg = "Menggunakan context saat visualisasi jumlah keyword berjalan dapat melambatkan respon line chart. Lanjutkan?";    
        if (!$("#linecontext").is(":visible") && keywordchart.rects != null) {
            if(confirm(msg)){
                $('#linecontext').slideToggle(250, unzoom);
            } else {
                $("#zoombutton").removeClass("active");
                return null;
            }
        } else {
            $('#linecontext').slideToggle(250, unzoom);
        }      
    });
    
    /*
     * Listener for toggle switching sliding interface
     */
    $('#settingRentang').click(function() {
        $('.tampilsetting').slideToggle(250);
        if ($('#ubahRentang').attr('disabled') == null) {
            $('#ubahRentang').attr('disabled', '');
        }else {
            $('#ubahRentang').removeAttr('disabled');
        }
    });

    /*
     * Listeners for setting default slider interface
     * default slider interface = gc.defaulUbahRentang
     */
    $('#setSlider').click(function() {
        gc.defaultUbahRentang = '#slidepick';
        var isactive = $('#setSlider').attr('class');
            if (isactive.indexOf('active') != -1) {
                $('#setSlider').attr('class', isactive);
            }else {
                $('#setSlider').attr('class', isactive + ' active');
            }
        var set = $('#setDatepick').attr('class').replace('active', '');
        $('#setDatepick').attr('class', set);
        $('#datepick').hide('slow');
        $('#slidepick').show('slow');
    });
    $('#setDatepick').click(function() {
     gc.defaultUbahRentang = '#datepick';
        var isactive = $('#setDatepick').attr('class');
            if (isactive.indexOf('active') != -1) {
            $('#setDatepick').attr('class', isactive);
            }else {
            $('#setDatepick').attr('class', isactive + ' active');
            }
        var set = $('#setSlider').attr('class').replace('active', '');
        $('#setSlider').attr('class', set);
        $('#slidepick').hide('slow');
        $('#datepick').show('slow');
    });

    /*
     * Listener for toggling slider visibility
     */
    $('#ubahRentang').click(function() {
        rentangEye();    
        $(gc.defaultUbahRentang).slideToggle(250);  
    });
    
    /*
     * Listener for shutting eye icons on toggle line visibility buttons :)
     */
    function rentangEye(){
        if ($("#datepick").is(":visible") || $("#slidepick").is(":visible") ) {
            $("#rentangeye").attr('class', 'icon-eye-close');
            if ($('#settingRentang').attr('disabled') == null) {
                $('#settingRentang').attr('disabled', '');
            }else {
                $('#settingRentang').removeAttr('disabled');
            }
            return null;
        }else {
            $("#rentangeye").attr('class', 'icon-eye-close');
            if ($('#settingRentang').attr('disabled') == null) {
                $('#settingRentang').attr('disabled', '');
            }else {
                $('#settingRentang').removeAttr('disabled');
            }
            $("#rentangeye").attr('class', 'icon-eye-open');
            return null;
        }
    };
    
    
    /*
     * View Modal listeners
     */
    $("#overviewinfo").click(function() {
        $("#modaloverview").modal('show');
    });
    
    //TODO: WHAT IS THIS FOR??
    $('#fullkeyword').click(function() {
        topTweet(this);
    });

    /*
     * 
     */
    $('#calDate1').datepicker({
        dateFormat: 'yy-mm-dd',
        numberOfMonths: 2,
        onSelect: function(selectedDate ) {
            $('#calDate2').datepicker('option', 'minDate', selectedDate);
        }
    });
    
    $('#calDate2').datepicker({
        dateFormat: 'yy-mm-dd',
        numberOfMonths: 2,
        onSelect: function(selectedDate ) {
            $('#calDate1').datepicker('option', 'maxDate', selectedDate);
        }
    });


    initbarchart();
    initLineChart('perday', false);
    //initSlider();
    setTimeout('initDatePicker()',3000);
    //$("#modaloverview").modal('show');
    //searchkeyword('pakai',true);
              
}


var linechart = new vizconfig();
    linechart.margin = [20, 35, 40, 50, 60];
    linechart.circlesize = [3,4,5,6];
    linechart.width = $("#linegraph").width();
    linechart.height = $("#linegraph").height() - linechart.margin[1];
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
    contextchart.height = $("#linecontext").height();;
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

var allsvg = d3.select('#linegraph').append('svg:svg')
		.attr('class', 'view')
	    .attr('width', linechart.width)
	    .attr('height', linechart.height + linechart.margin[0] + linechart.margin[2])
	    .on('mouseover.chart', circopacity(1))
	    .on('mouseout.chart', circopacity(0));

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

var contsvg = d3.select('#linecontext').append('svg:svg')
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
    
linechart.resetButton = allsvg.append("text")
          .attr('class','resetoff')
          .attr('x', (linechart.width - 70 ))
          .attr('y', (linechart.height/16))
          .attr('dx', 0)
          .attr('dy', '.15em')
          .attr('text-anchor', 'start')
          .attr('fill', '#000')
          .style('font', '10pt Arial')
          .style('text-shadow', '1px 1px 2px rgba(0,0,0,.3)')
          .text('RESET');


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
 		  		$('#viewcontrols button').attr('class', 'btn');
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
    if(update && gc.timeUnit === unit){
        return null;
    }
	linechart.loading(true);
	
    $("#infoSatuanWaktu").text(unit == 'perday' ? 'Hari' : 'Jam');
    
	gc.timeUnit = unit;
    
    d3.csv( gc.getLineUrl+'?unit='+unit , function(error, data) {
      if (error) return console.log("there was an error loading the data: " + error);  
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
    }).on("progress", function() {
    //console.log("progress..", d3.event.loaded);
    });

}

function initDrawLine(datasetline,datasetcircle,date1,date2) {
    initKeywordRanks();
    
    gc.totalNegatif = datasetline[0].sumJumlah;
    gc.totalPositif = datasetline[1].sumJumlah;
    gc.totalNonopini = datasetline[2].sumJumlah;
    $("#maxNegatifInfo").text(gc.totalNegatif);
    $("#maxPositifInfo").text(gc.totalPositif);
    $("#maxNonopiniInfo").text(gc.totalNonopini);
    
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
		
    drawLineChart();

}

function drawLineChart() {

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
    var e = d3.select(this);
    e.append("svg:circle")
    .attr("r", circlesize())
    .attr("id", function(d){
        var ids = 'circ' + d.orientasi + '_' + d.date.getDate() + '_' + d.date.getHours()+"_"+gc.timeUnit;
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
    .attr('cy' , function(d) { 
        return linechart.yScale(d.jumlah);
        })
	.style('opacity', '0')
	.on('mouseover.circles', function(d) {
	   var element = d3.select(this);
	   element.attr('stroke-width', '8px');
	})
	.on('mouseout.circles', function(d) {
            var change = d3.select(this);
            change.attr('stroke-width', '2px');
     })
    .on('click.circles', function(d) {
		clickCircle(d, this);
	});
  });
  
  initAllOpentips();  
  contextbacksvg.select('.xContextAxis').call(contextchart.xAxis);
  backsvg.select('.xAxis').call(linechart.xAxis);
  backsvg.select('.yAxis').call(linechart.yAxis);
  linechart.loading(false);
}

function initAllOpentips() {
    
    d3.selectAll(".apoint").attr("",function(d,i){
                      var ids = '#'+this.id;
                      new Opentip(ids, { 
                          style: 'circ',
                          borderColor: gc.colorOrientasi(d.orientasi)
                          });
                  });   
}

function clickCircle(d, element){
    var requestKeyWords, reqTweet, keyWords, setKeywords;
            setInfoCircle(d.date, d.jumlah, d.orientasi, gc.timeUnit, element.id);
            var optp = $('#'+element.id).data('opentips')[0];
                        //Get & Set Tooltip buat info keyword
                        if (gc.timeUnit == 'perday') {
                            requestKeyWords = gc.getKeywUrl + '?tg='+ (d.tgl) + '&or='+ d.orientasi + '&track=no';
                                d3.text(requestKeyWords, function(keys) {   
                                    keyWords = keys.trim(keys.lastIndexOf(' ')-1).split(' ').join(',');
                                    setKeywords = keys.trim(keys.lastIndexOf(' ')-1).split(' ').join(', ');
                                    reqTweet = gc.getTweetUrl + '?tg='+ d.tgl + '&or='+ d.orientasi + '&atom='+ gc.timeUnit + '&kw='+ keyWords + ',';  
                                    optp.setContent(setKeywords);
                                $('#fullkeyword').text(setKeywords);
                                $('#tweetcontainer').html(gc.loadingGIF).load(reqTweet);
                                d3.select(element).attr('stroke', '#6283ff')
                                                    .attr('stroke-width', '1px');
                                optp.show();   
                                });
                        }else {
                            requestKeyWords = gc.getKeywUrl + '?tg='+ (d.tgl) + '&or='+ d.orientasi + '&track=no';
                                d3.text(requestKeyWords, function(keys) {
                                    keyWords = keys.trim(keys.lastIndexOf(' ')-1).split(' ').join(',');
                                    setKeywords = keys.trim(keys.lastIndexOf(' ')-1).split(' ').join(', ');
                                    reqTweet = gc.getTweetUrl + '?tg='+ (d.tgl.replace(' ', '%20')) + '&or='+ d.orientasi + '&atom='+ gc.timeUnit + '&rc='+ d.jumlah + '&kw='+ keyWords + ',';         
                                    optp.setContent(setKeywords);
                                    $('#fullkeyword').text(setKeywords);
                                    $('#tweetcontainer').html(gc.loadingGIF).load(reqTweet);
                                    d3.select(element).attr('stroke', '#6283ff')
                                                        .attr('stroke-width', '1px');
                                    optp.show();
                                });
                        }
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
  	drawkeywordchart();
  }
  if(currentDomain[0].toString() != gc.firstDate.toString() ||currentDomain[1].toString() != gc.lastDate.toString() ){
      linechart.resetButton.attr('class','resetline');
  }else{
      
      linechart.resetButton.attr('class','resetoff');
  }
  
  
}



function circlesize(chartsize) {

    if (chartsize >= 11 && chartsize <= 15) {
      return linechart.circlesize[1];
    }else if (chartsize >= 5 && chartsize <= 10) {
      return linechart.circlesize[2];
    }else if (chartsize >= 0 && chartsize <= 4) {
      return linechart.circlesize[3];
    }else {
      return linechart.circlesize[0]; //default circlesize;
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


/* END LINE JS */

/* START MISC JS */

var assa;

// KEYWORD RANKS
function initKeywordRanks(){
var kwdataset = d3.select('#kwlistdataset').append('ul').attr('class','ulkw');
var kwbigneg = d3.select('#kwlistnegatif').append('ul').attr('class','ulkw');
var kwbigpos = d3.select('#kwlistpositif').append('ul').attr('class','ulkw');
var kwbignon = d3.select('#kwlistnonopini').append('ul').attr('class','ulkw');
    
kwdataset.selectAll('.kw').data(gc.jsondataset)
                        .enter().append('li').attr('class','kw').attr('data-orient','dataset')
                        .append('strong')
                        .text(function(d,i){
                            i++;
                            return i+'. "'+d.key.concat()+'"';
                        }).append('text').attr('class', 'numkwrank')
                        .text(function(d){
                            return ' ( '+d.val+' tweet )  ';
                        });
                        
kwbigneg.selectAll('.kw').data(gc.jsonbigneg)
                        .enter().append('li').attr('class','kw').attr('data-orient','negatif')
                        .append('strong')
                        .text(function(d,i){
                            i++;
                            return i+'. "'+d.key.concat()+'"';
                        }).append('text').attr('class', 'numkwrank')
                        .text(function(d){
                            return ' ( '+d.val+' tweet )';
                        });
                        
kwbigpos.selectAll('.kw').data(gc.jsonbigpos)
                        .enter().append('li').attr('class','kw').attr('data-orient','positif')
                        .append('strong')
                        .text(function(d,i){
                            i++;
                            return i+'. "'+d.key.concat()+'"';
                        }).append('text').attr('class', 'numkwrank')
                        .text(function(d){
                            return ' ( '+d.val+' tweet )';
                        });
                        
kwbignon.selectAll('.kw').data(gc.jsonbignon)
                        .enter().append('li').attr('class','kw').attr('data-orient','nonopini')
                        .append('strong')
                        .text(function(d,i){
                            i++;
                            return i+'. "'+d.key.concat()+'"';
                        }).append('text').attr('class', 'numkwrank')
                        .text(function(d){
                            return ' ( '+d.val+' tweet )';
                        });

        d3.selectAll('.kw').on('click.kwviz', function(d) {
            $("#overviewtext").text('Jumlah kemunculan tweet yang menyebut kata "'+ d.key +'" di kategori '+ this.getAttribute('data-orient') );
            var orient = this.getAttribute('data-orient') == 'dataset'? null : this.getAttribute('data-orient');
            searchkeyword(d.key, true, orient);
            
            return null;
        });
        
        d3.selectAll('.ulkw li').on('click.ulkw', function(d){
           $(".ulkw li").removeAttr('style'); 
           d3.select(this).style('background-color','#ddd'); 
        });
}


// END -- KEYWORD RANKS


// PIE VISUALIZATION
var piechart = new vizconfig();
    piechart.width = 30;
    piechart.height = 30;
    piechart.r = Math.min(piechart.width, piechart.height) / 2;
    piechart.colorScale = d3.scale.ordinal().domain([0,1,2]).range(['#FF0000', '#009900', '#FAA732']);
    piechart.arc = d3.svg.arc().outerRadius(piechart.r);
    piechart.donut = d3.layout.pie();
    piechart.paths;
    piechart.vis;

var pieGround = d3.select("#pie").append("svg")
    .attr("width", piechart.width + 20)
    .attr("height", piechart.height + 20);
    
function makePie(key) {
    if(!key){
        if(piechart.vis!=null){
            piechart.paths.attr("fill","#ddd");
            $("#pie").popover("destroy");
            return false;
        }else{
            return null;
        }
    }
    
    var getPieData = gc.getPieData+'&key='+key;
    if(piechart.vis!=null) {piechart.vis.remove();};
        d3.json( getPieData, function(PieData) {
        
            piechart.vis = pieGround.selectAll(".onePie")
                        .data([PieData])
                        .enter().append("svg:g")
                        .attr("transform", gc.translate(5,5))
                        .attr("class",function(d){
                            $("#pie").popover('destroy');
                            var infoPie = "<strong> \""+key+"\"</strong> ditemukan di :</br>"+
                                        "- <strong>"+d[0]+ "</strong> tweet negatif</br>"+
                                        "- <strong>"+d[1]+"</strong> tweet positif </br>"+
                                        "- <strong>"+d[2]+"</strong> tweet non-opini";                                     
                            gc.pieTip.setContent(infoPie);                                        
                            /*
                            $("#pie").popover({
                                            html: true,
                                            title: infoPieTitle,
                                            content: infoPie,                                          
                                            placement: "top",
                                            trigger: "hover",
                                            });
                            */
                            return "aPie";        
                            });
            
            var arcs = piechart.vis.selectAll("g.arc")
                .data(piechart.donut)
              .enter().append("g")
                .attr("class", "arc")
                .attr("transform", gc.translate(piechart.r, piechart.r));
            
            piechart.paths = arcs.append("path")
                .attr("fill", function(d, i) { return piechart.colorScale(i); });
            
            piechart.paths.transition()
                .ease("bounce")
                .duration(gc.duration[4])
                .attrTween("d", tweenPie);
            
            
            function tweenPie(b) {
              b.innerRadius = 0;
              var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
              return function(t) {
                return piechart.arc(i(t));
              };
            }
        
        });
    
    return true;
}
//--- END PIE VISUALIZATION


var keywordchart = new vizconfig();
    keywordchart.width = linechart.width;
    keywordchart.height = linechart.height;
    keywordchart.xScale = d3.scale.ordinal()
                           .rangeRoundBands([0, linechart.width - linechart.margin[4]], .1);
    keywordchart.yScale = d3.scale.linear()
                            .range([0, linechart.height / 4]);
    keywordchart.colorScale = d3.scale.linear()
                                .interpolate(d3.interpolateRgb).range(['#ffffff', '#b0c1ff']);
    
    keywordground.attr('width', keywordchart.width - linechart.margin[4])
      .attr('height', keywordchart.height)
      .attr('transform', gc.translate(linechart.margin[2],1))
    
function searchkeyword(key, isOverview, orient) {
    var request = orient == null ? gc.getKeywUrl+'?track=yes&key='+ key : gc.getKeywUrl+'?track=yes&key='+ key +'&or='+orient;
    d3.json(request, function(data) {
        if (data[0] == null) {
            //var msg = 'Kata kunci '+ key + ' tidak ditemukan';
            makePie(false);
            linechart.loading(false);
            $("#totalJum").text("0");
            //gc.infoError(msg,true);
            return null;
        }else {
            
            data.forEach(function(d) {
                d.tanggal = gc.parseTanggal(d.tanggal);
                d.jumlah = +d.jumlah;
            });
            var maxJum = d3.max(data.map(function(d) { return +d.jumlah}), function(d) { return d;});
            //var minJum = d3.min(data.map(function(d) { return d.jumlah}), function(d) { return d;});
            var totalJum = d3.sum(data.map(function(d){ return +d.jumlah;}), function(d){ return d;});
  
            if(isOverview){
                drawKDC(data, maxJum, totalJum,orient);
            }else{
                keywordchart.datas = data;
                keywordchart.maxJum = maxJum;
                keywordchart.totalJum = totalJum;
                drawkeywordchart();
                makePie(key);
            }
            
            return null;
        }
    });


}

function resultkeyword(key) {
    key= key.replace(' ','%20');
    var request = gc.getTweetUrl + '?top=yes&kw='+ key;
    $('#keywordresult').html(gc.loadingGIF).load(request);
    $('#keywordtitle').text(key);
}


function drawkeywordchart() {
        linechart.loading(true);
        keywordchart.rects == null ? null : resetbgkeyword();
        $("#totalJum").text(keywordchart.totalJum);
        
        keywordchart.colorScale.domain([0, keywordchart.maxJum]);
        
        var rectwidth = (keywordchart.width - linechart.margin[4]) / selisih(linechart.xScale.domain());
        
        keywordchart.rects = keywordground.selectAll('.keywordrect')
                            .data(keywordchart.datas).enter().append('svg:g').attr('class', 'onerect');
        
        
        keywordchart.rects.append('svg:rect')
                    .attr('filter', 'url(#blurify)')
                    .attr('opacity',0)
                    .attr('height', linechart.height)
                    .on('mouseover.rect', function(d,i) {
                        $('#jumkw_'+ i).show();
                        $('#kw_'+ i).show();
                        $('#daykw_'+ i).show();
                    })
                    .on('mouseout.rect', function(d,i) {
                        $('#jumkw_'+ i).hide();
                        $('#kw_'+ i).hide();
                        $('#daykw_'+ i).hide();
                    })
                    .attr('fill', function(d) {
                        return keywordchart.colorScale(d.jumlah);
                    })
                    .attr('width', rectwidth)
                    .attr('x', function(d) {
                            return linechart.xScale(d.tanggal);
                     }).transition().delay(250).duration(1500)
                     .attr('opacity', 1);

        keywordchart.rects.append('text')
               .text(function(d) {
                    return d.jumlah;
                })
              .attr('class', 'hide')
              .attr('id', function(d,i) {
                return 'jumkw_'+ i;
              })
              .attr('x', function(d) {
                    return linechart.xScale(d.tanggal);
                    })
              .attr('y', linechart.height / 15)
              .attr('dx', 25)
              .attr('dy', '.15em')
              .attr('text-anchor', 'middle')
              .style('font-size', '20pt');


         keywordchart.rects.append('text')
              .text($('#searchkeyword').val())
              .attr('class', 'hide')
              .attr('id', function(d,i) {
                return 'kw_'+ i;
              })
              .attr('x', function(d) {
                    return linechart.xScale(d.tanggal);
                    })
              .attr('y', linechart.height / 9)
              .attr('dx', 30)
              .attr('dy', '.25em')
              .attr('text-anchor', 'middle')
              .style('font-size', '10pt');

          keywordchart.rects.append('text')
              .text(function(d) {
                return d.tanggal.getDate() + ' '+ gc.nama_bulan[d.tanggal.getMonth() + 1];
                })
              .attr('class', 'hide')
              .attr('id', function(d,i) {
                return 'daykw_'+ i;
              })
              .attr('x', function(d) {
                    return linechart.xScale(d.tanggal);
                    })
              .attr('y', linechart.height / 6)
              .attr('dx', 25)
              .attr('dy', '.15em')
              .attr('text-anchor', 'middle')
              .style('font-size', '8pt');
              
        linechart.loading(false);
}

function resetbgkeyword(set) {
    keywordchart.rects.remove();
    keywordchart.rects = null;
    if (set == 'full') {
        keywordchart.datas.length = 0;
        keywordchart.rects = null;
    }
}
function isKeywordEmpty() {
    if ($('#searchkeyword').val() != '') {
        return false;
    }else {
        return true;
    }
}

//KEYWORD DISTRIBUTION CHART
var kdc = new vizconfig();
    kdc.width = 981;
    kdc.height = 120;
    kdc.xScale = d3.time.scale().range([0, kdc.width]);
   
    kdc.yScale = d3.scale.linear()
                            .rangeRound([0, kdc.height-35]);
                       
    kdc.xAxis = d3.svg.axis()
                        .scale(kdc.xScale)
                        .tickSize(-kdc.height)
                        .tickPadding(10)
                        .ticks(8)
                        .ticks(d3.time.days).tickFormat(d3.time.format('%d/%b'));
    kdc.yAxis = d3.svg.axis()
                        .scale(kdc.yScale)
                        .tickSize(kdc.width)
                        .ticks(5);
    kdc.isAxis = null;
    
var kdcground = d3.select('#kwdistribution').append('svg')
                .attr('width', kdc.width)
                .attr('height', kdc.height)
                .append('g')
                .attr('class','kdcground');
                
function drawKDC(data, maxJum, totalJum,orient){
     
     orient = orient == null ? '#317cc5' : gc.colorOrientasi(orient);
     kdc.xScale.domain([gc.firstDate, gc.lastDate]);
     kdc.yScale.domain([0,maxJum]);
     
     var kdcbar = kdcground.selectAll('.kdcrects')
                  .data(data, function(d){
                      return d.jumlah
                  });
     //FIXME: updating jumlah belum beres
     var kdctext = kdcground.selectAll('.kdctexts')
                   .data(data, function(d){
                       return d.jumlah;
                   });
                                 
     kdcbar.enter().append('rect')
            .attr('class','kdcrects')
            .attr('transform',gc.translate(2,-20));
            
     kdcbar.attr('x', function(d){
         
                return kdc.xScale(d.tanggal);
            })
            .attr('y', function(d){
                return kdc.height - kdc.yScale(d.jumlah);
            })
            .attr('width', kdc.width/gc.dateSize - 5)
            .attr('height', function(d){
                return kdc.yScale(d.jumlah);
            })
            .attr('fill','#fff')
            .attr('stroke-width',function(d){
                var wdth ;
                if(+d.jumlah == maxJum){
                    wdth = 3;
                }else{
                    wdth = 1;
                }
                return wdth;
            })
            .attr('stroke',' #000')
            .transition().duration(500)
            .attr('fill', orient);
            
     kdctext.enter().append('text')
           .attr('class', 'kdctexts')
           .attr('x', function(d){
                return kdc.xScale(d.tanggal) + 20;
            })
           .attr('y', 10)
           .attr('dx', 0)
           .attr('dy', '0em')
           .attr('text-anchor', 'start')
           .attr('fill', '#000')
          .style('font', function(d){
              if(+d.jumlah == maxJum){
                    return '1em bold';
                }else{
                    return '0.8em Arial Narrow';
                }
          })
          .text(function(d) { 
              return +d.jumlah; });
     
     if(kdc.isAxis == null) {
         kdc.isAxis = kdcground.append('g').attr('class','xAxisKDC')
                .attr('transform', gc.translate(22,95)).call(kdc.xAxis) ;
     }       
      
            
     kdcbar.exit().remove();
     kdctext.exit().transition().remove();
}

//-- END KDC

/* END MISC JS */

/* START BAR JS */
                              
var barchart = new vizconfig();
    barchart.margin = [5, 10, 20, 25];
    barchart.width = 215 ;
    barchart.height = 70;
    barchart.xScale = d3.scale.linear().range([0, (barchart.width-barchart.margin[2])]);
    barchart.yScale = d3.scale.ordinal().rangeRoundBands([0, barchart.height], .1);
    barchart.xAxis = d3.svg.axis().scale(barchart.xScale).tickSubdivide(true).orient('top').tickSize(-barchart.height).tickValues([5000, 15000]);


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
	  	.attr('fill', '#E6E6E6')
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

/* END BAR JS */

/* START CONTROL JS */

function setInfoRentang(date1, date2) {
	var infos = d3.selectAll('#inforentang');
	infos.selectAll('text').remove();
	date1 = Number(date1.substr(8, 2)) + ' ' + gc.nama_bulan[Number(date1.substr(5, 2))];
	date2 =	Number(date2.substr(8, 2)) + ' ' + gc.nama_bulan[Number(date2.substr(5, 2))];
	if (date1 !== date2) {
        infos.append('text').text('Sejak ');
        infos.append('text').attr('class', 'textrentang').text(date1);
        infos.append('text').text(' hingga ');
        infos.append('text').attr('class', 'textrentang').text(date2);
	} else {
	 infos.append('text').text('Pada ');
	 infos.append('text').attr('class', 'textrentang').text(date1);
	}
}

function initSlider() {
    var select1 = $('#dates1'),
        select2 = $('#dates2');
    setInfoRentang(gc.strFirstDate, gc.strLastDate);
        
    gc.dateList.forEach(function(d){
        select1.append($('<option />').val(d.date).text(Number(d.date.substr(8, 2)) + ' '+ gc.nama_bulan[Number(d.date.substr(5, 2))]));
        select2.append($('<option />').val(d.date).text(Number(d.date.substr(8, 2)) + ' '+ gc.nama_bulan[Number(d.date.substr(5, 2))]));   
    });
    /*
    $.each(gc.dateList, function() {
    select1.append($('<option />').val(this.date).text(Number(this.date.substr(8, 2)) + ' '+ gc.nama_bulan[Number(this.date.substr(5, 2))]));
    select2.append($('<option />').val(this.date).text(Number(this.date.substr(8, 2)) + ' '+ gc.nama_bulan[Number(this.date.substr(5, 2))]));
    });
    */

    $('#dates2')[0].selectedIndex = gc.dateSize - 1;

            $('#slider').slider({
                max: gc.dateSize,
                min: 1,
                values: [1, gc.dateSize],
                range: true,
                start: function(event, ui) {
                    $('.textrentang').css('color', '#FF0000');
                },
                slide: function(event, ui ) {
                    select1[0].selectedIndex = ui.values[0] - 1;
                    select2[0].selectedIndex = ui.values[1] - 1;
                    setInfoRentang(
                        $('#dates1 option:selected').val(),
                        $('#dates2 option:selected').val()
                    );
                    $('.textrentang').css('color', '#FF0000');
                },
                change: function(event, ui ) {
                    var dd1 = $('#dates1 option:selected').val() + ' 00';
                    var dd2 = $('#dates2 option:selected').val() + ' 23';
                    var passDomain = [dd1, dd2];
                    setDomain(passDomain, true);
                    updatebarchart(
                        $('#dates1 option:selected').val(),
                        $('#dates2 option:selected').val()
                    );
                },
                stop: function(event, ui) {
                    $('.textrentang').removeAttr('style');
                }
            });

};

$.getJSON(gc.getDateListUrl, function (dl){ 
                gc.dateList = dl;
                gc.dateSize = dl.length;
                gc.firstDate = new Date(dl[0].date);
                gc.lastDate = new Date(dl[dl.length - 1].date);
                gc.strFirstDate = dl[0].date;
                gc.strLastDate = dl[dl.length - 1].date;
                gc.firstDate.setHours(00);
                gc.lastDate.setHours(23);
                initSlider();
                return false;
            });


function setInfoCircle(tanggal, jumlah, orientasi, per, circleid) {
	var infos = d3.select('#infoCircle');
	infos.selectAll('button').remove();
	var infwkt = infos.append('button').attr('class', 'btn btn-mini');
	if (per == 'perday') {
		infwkt.append('text').text(' '+ tanggal.getDate() + ' '
									+ gc.nama_bulan[(tanggal.getMonth() + 1)]);
	}else {
		infwkt.append('text').text(' '+ tanggal.getDate() + ' '
									+ gc.nama_bulan[(tanggal.getMonth() + 1)] + ' Jam '
									+ (tanggal.getHours() < 10 ? ('0' + (tanggal.getHours())) : tanggal.getHours()) + ':'
									+ (tanggal.getMinutes() < 10 ? ('0' + (tanggal.getMinutes())) : tanggal.getMinutes())
									);
	}
	var infjml = infos.append('button')
	.attr('class', function() {
		switch (orientasi) {
		case 'negatif':
			return 'btn btn-danger btn-mini ';
		case 'positif':
			return 'btn btn-success btn-mini';
		case 'nonopini':
			return 'btn btn-warning btn-mini';
		}
	});
	infjml.append('text').text(jumlah + ' tweet '+ orientasi + ' ');
	infjml.append('text').text(circleid).attr('class', 'hidden').attr('id', 'getcircleid');
	infjml.on('click.infjml', function(d) {
	    var circid = '#'+ $('#getcircleid').text();
	    d3.select(circid)
	       .transition().duration(200)
	           .style('opacity', 1)
	       .transition().delay(2000).duration(15000)
	           .style('opacity', 0);
	   $(circid).data('opentips')[0].show();
	   $(circid).data('opentips')[0].prepareToHide();
	});
}

function setInfoWaktuBlank() {
	var infos = d3.select('#infoCircle');
	var btns = infos.selectAll('button');
	btns.attr('class', 'btn btn-mini minwidth100 setopacity3').text('---');
}



$('#ubahcalendar').click(function() {
	var dd1 = $('#calDate1').val() + ' 00';
	var dd2 = $('#calDate2').val() + ' 23';
	var passDomain = [dd1, dd2];
	
	setDomain(passDomain, true);

	updatebarchart(
				   $('#calDate1').val(),
				   $('#calDate2').val()
				  );
    setInfoRentang(
    			   $('#calDate1').val(),
				   $('#calDate2').val()
					);
});