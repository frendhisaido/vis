// PIE VISUALIZATION
var pieW = 30,
    pieH = 30,
    pieR = Math.min(pieW, pieH) / 2,
    color = d3.scale.ordinal().domain([0,1,2]).range(['#FF0000', '#009900', '#FAA732']),
    arc = d3.svg.arc().outerRadius(pieR),
    donut = d3.layout.pie();
    //console.log(data);
var vis;

    
var pieGround = d3.select("#pie").append("svg")
    .attr("width", pieW + 20)
    .attr("height", pieH + 20);
    
function makePie(key) {
    var getPieData = 'http://localhost/vis/data/getKeyword.php?track=count&key='+key;
    if(vis!=null) {vis.remove();};
        d3.json( getPieData, function(PieData) {
        
            vis = pieGround.selectAll(".onePie")
                        .data([PieData])
                        .enter().append("svg:g")
                        .attr("transform", "translate(" + 5 + "," + 5 + ")")
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
            
            var arcs = vis.selectAll("g.arc")
                .data(donut)
              .enter().append("g")
                .attr("class", "arc")
                .attr("transform", "translate(" + pieR + "," + pieR + ")");                
            
            var paths = arcs.append("path")
                .attr("fill", function(d, i) { return color(i); });
            
            paths.transition()
                .ease("bounce")
                .duration(2000)
                .attrTween("d", tweenPie);
            
            
            function tweenPie(b) {
              b.innerRadius = 0;
              var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
              return function(t) {
                return arc(i(t));
              };
            }
        
        });
    
    return null;
}
//--- END PIE VISUALIZATION

function searchkeyword(key) {
    
    $('#loading').css('display', 'block');
    rectkeyword == null ? null : resetbgkeyword();
    var request = 'data/getKeyword.php?track=yes&key='+ key;
    makePie(key);
    //console.log(request);
    d3.json(request, function(data) {
        if (data[0] == null) {
            alert('Kata kunci '+ key + ' tidak ditemukan');
            $('#loading').css('display', 'none');
        }else {
            data.forEach(function(d) {
                d.tanggal = parseTanggal(d.tanggal);
                d.jumlah = +d.jumlah;
            });
            var maxJum = d3.max(data.map(function(d) { return d.jumlah}), function(d) { return d;});
            var lastdate = d3.max(data, function(d) { return d.tanggal; });
            var firstdate = d3.min(data, function(d) { return d.tanggal; });
            var totalFound = d3.sum(data.map(function(d){ return d.jumlah;}), function(d){ return d;});
            
            $("#totalFound").text(totalFound);
            kwScale.domain([0, maxJum]);
            kwrectclor.domain(kwScale.domain());
            datakeyword = data;

            drawbgkeyword();

            $('#loading').css('display', 'none');
        }
    });

return null;
}

function resultkeyword(key) {
    key= key.replace(' ','%20');
    var request = getTweetUrl + '?top=yes&kw='+ key;
    $('#keywordresult').load(request, function() {
        $('#tampilkeyword').toggle();
        $('#tampilkeyword').attr('title', key);
    });
    $('#keywordtitle').text(key);
}
