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






