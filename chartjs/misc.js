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
    
    var getPieData = 'http://localhost/vis/data/getKeyword.php?track=count&key='+key;
    if(piechart.vis!=null) {piechart.vis.remove();};
        d3.json( getPieData, function(PieData) {
        
            piechart.vis = pieGround.selectAll(".onePie")
                        .data([PieData])
                        .enter().append("svg:g")
                        .attr("transform", gc.translate(5,5))
                        .attr("class",function(d){
                            $("#pie").popover('destroy');
                            var infoPieTitle = "<strong> \" "+key+" \"</strong> ditemukan di : "; 
                            var infoPie = "<strong>"+d[0]+ "</strong> tweet negatif</br> <strong>"+d[1]+
                                        "</strong> tweet positif </br> <strong>"
                                        +d[2]+"</strong> tweet non-opini";
                            
                            $("#pie").popover({
                                            html: true,
                                            title: infoPieTitle,
                                            content: infoPie,                                          
                                            placement: "top",
                                            trigger: "hover",
                                            });
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
    keywordchart.datas ;
    
    keywordground.attr('width', keywordchart.width - linechart.margin[4])
      .attr('height', keywordchart.height)
      .attr('transform', gc.translate(linechart.margin[2],1))
    
function searchkeyword(key) {
    
    linechart.loading(true);
    keywordchart.rects == null ? null : resetbgkeyword();
    var request = gc.getKeywUrl+'?track=yes&key='+ key;
    
    //console.log(request);
    d3.json(request, function(data) {
        if (data[0] == null) {
            //var msg = 'Kata kunci '+ key + ' tidak ditemukan';
            makePie(false);
            linechart.loading(false);
            $("#totalFound").text("0");
            //gc.infoError(msg,true);
            return null;
        }else {
            
            data.forEach(function(d) {
                d.tanggal = gc.parseTanggal(d.tanggal);
                d.jumlah = +d.jumlah;
            });
            var maxJum = d3.max(data.map(function(d) { return d.jumlah}), function(d) { return d;});
            var totalFound = d3.sum(data.map(function(d){ return d.jumlah;}), function(d){ return d;});
            
            $("#totalFound").text(totalFound);
            
            keywordchart.colorScale.domain([0, maxJum]);
            
            keywordchart.datas = data;
            
            drawbgkeyword();
            makePie(key);

            linechart.loading(false);
            return null;
        }
    });


}

function resultkeyword(key) {
    key= key.replace(' ','%20');
    var request = gc.getTweetUrl + '?top=yes&kw='+ key;
    $('#keywordresult').load(request, function() {
        $('#tampilkeyword').toggle();
        $('#tampilkeyword').attr('title', key);
    });
    $('#keywordtitle').text(key);
}


function drawbgkeyword() {
       
        
        var rectwidth = (keywordchart.width - linechart.margin[4]) / selisih(linechart.xScale.domain());
        
        keywordchart.rects = keywordground.selectAll('.keywordrect')
                            .data(keywordchart.datas).enter().append('svg:g').attr('class', 'onerect');
        
        
        keywordchart.rects.append('svg:rect')
                    .attr('filter', 'url(#blurify)')
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
                        });

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

}

function resetbgkeyword(set) {
    keywordchart.rects.remove();
    if (set == 'full') {
        keywordchart.datas.length = 0;
    }
}
function isKeywordEmpty() {
    if ($('#searchkeyword').val() != '') {
        return false;
    }else {
        return true;
    }
}

