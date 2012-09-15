

var totaldates = 0;
var nama_bulan = new Array("0","Januari", "Februari", "Maret", 
	"April", "Mei", "Juni", "Juli", "Agustus", "September", 
	"Oktober", "November", "Desember");

$.getJSON("data/datelist.php", function(result) {
		totaldates = result.length;
	
	
	
		var select1 = $("#dates1");
		var select2 = $("#dates2");
	    setInfoRentang(result[0].date, result[totaldates-1].date);
	    
	$.each(result, function() {
	select1.append($("<option />").val(this.date).text(Number(this.date.substr(8,2))+" "+nama_bulan[Number(this.date.substr(5,2))]));
	select2.append($("<option />").val(this.date).text(Number(this.date.substr(8,2))+" "+nama_bulan[Number(this.date.substr(5,2))]));
	});
			
	
	$("#dates2")[ 0 ].selectedIndex = totaldates-1;
		
			$("#slider").slider({
				max : totaldates,
				min : 1,
				values : [1,totaldates],
				range: true,
				start: function(event, ui){
				},
				slide: function( event, ui ) {
					select1[ 0 ].selectedIndex = ui.values[0] -1;
					select2[ 0 ].selectedIndex = ui.values[1] -1;
					setInfoRentang(
						$("#dates1 option:selected").val(),
						$("#dates2 option:selected").val()
					);
				},
				change: function( event, ui ) {
					var dd1 = $("#dates1 option:selected").val()+" 00";
					var dd2 = $("#dates2 option:selected").val()+" 23";
					var passDomain = [dd1, dd2];
					//console.log(passDomain);
					passingDomain(passDomain);
					updatebarchart(
						$("#dates1 option:selected").val(),
						$("#dates2 option:selected").val()
					);
				}
			});
			
});

function setInfoRentang(date1,date2){
	var infos = d3.select("#inforentang");
	infos.selectAll("text").remove();
	date1 = Number(date1.substr(8,2))+" "+nama_bulan[Number(date1.substr(5,2))];
	date2 =	Number(date2.substr(8,2))+" "+nama_bulan[Number(date2.substr(5,2))];
	if(date1!=date2){
	 infos.append("text").text("Sejak ");
	 infos.append("text").attr("class","textrentang").text(date1);
	 infos.append("text").text(" hingga ");
	 infos.append("text").attr("class","textrentang").text(date2);
	}else{
	 infos.append("text").text("Pada ");
	 infos.append("text").attr("class","textrentang").text(date1);
	}
}

function setInfoCircle(tanggal, jumlah, orientasi){
	var infos = d3.select("#infoCircle");
	infos.selectAll("button").remove();
	
	var infjml = infos.append("button")
	.attr("class",function(){
		switch (orientasi){
		case 'negatif':
			return 'btn btn-danger';
		break;
		case 'positif':
			return 'btn btn-success';
		break;
		case 'nonopini':
			return 'btn';
		break;}
	})
	.style("width","180px");
	infjml.append("svg")
	.style("float","left")
	.attr("width","20px")
	.attr("height","20px")
	.append("circle")
	.attr("r","6px")
	.attr("cx",10)
	.attr("cy",10)
	.attr("fill",function(){
		var warna;
		switch (orientasi){
		case 'negatif':
			return '#FF0000';
		break;
		case 'positif':
			return '#009900';
		break;
		case 'nonopini':
			return '#969395';
		break;}
		}
		);
	infjml.append("text").text(jumlah + " tweet "+orientasi+" ");
	var infwkt = infos.append("button").attr("class","btn").style("width","180px");
	infwkt.append("i").attr("class","icon-time");
	infwkt.append("text").text(" "+tanggal.getDate()+" "
								+nama_bulan[(tanggal.getMonth()+1)]+" Jam "
								+(tanggal.getHours() < 10 ? ('0'+ (tanggal.getHours())) : tanggal.getHours())+":"
								+(tanggal.getMinutes() < 10 ? ('0'+ (tanggal.getMinutes())) : tanggal.getMinutes())
								);
}

function setInfoWaktuBlank(){
	var infos = d3.select("#infoCircle");
	var btns = infos.selectAll("button");
	btns.attr("class","btn").text("---");

	
	
}
