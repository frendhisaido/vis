



$.getJSON("data/datelist.php", function(result) {
		totaldates = result.length;
	
	
	
		var select1 = $("#dates1");
		var select2 = $("#dates2");
	    setInfoRentang(result[0].date, result[totaldates-1].date);
	    //setDatePicker(new Date(result[0].date),new Date(result[totaldates-1].date));
	    date1 = result[0].date;
	    date2 = result[totaldates-1].date;
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
					$(".textrentang").css("color","#FF0000");
				},
				slide: function( event, ui ) {
					select1[ 0 ].selectedIndex = ui.values[0] -1;
					select2[ 0 ].selectedIndex = ui.values[1] -1;
					setInfoRentang(
						$("#dates1 option:selected").val(),
						$("#dates2 option:selected").val()
					);
					$(".textrentang").css("color","#FF0000");
				},
				change: function( event, ui ) {
					var dd1 = $("#dates1 option:selected").val()+" 00";
					var dd2 = $("#dates2 option:selected").val()+" 23";
					var passDomain = [dd1, dd2];
					//console.log(passDomain);
					passingDomain(passDomain,true);
					updatebarchart(
						$("#dates1 option:selected").val(),
						$("#dates2 option:selected").val()
					);
				},
				stop: function ( event, ui){
					$(".textrentang").removeAttr("style");
				}
			});
			
});

function setInfoRentang(date1,date2){
	var infos = d3.selectAll("#inforentang");
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

function setInfoCircle(tanggal, jumlah, orientasi, per){
	var infos = d3.select("#infoCircle");
	infos.selectAll("button").remove();
	var infwkt = infos.append("button").attr("class","btn btn-mini");
	if(per=='perday'){
		infwkt.append("text").text(" "+tanggal.getDate()+" "
									+nama_bulan[(tanggal.getMonth()+1)]);	
	}else{
		infwkt.append("text").text(" "+tanggal.getDate()+" "
									+nama_bulan[(tanggal.getMonth()+1)]+" Jam "
									+(tanggal.getHours() < 10 ? ('0'+ (tanggal.getHours())) : tanggal.getHours())+":"
									+(tanggal.getMinutes() < 10 ? ('0'+ (tanggal.getMinutes())) : tanggal.getMinutes())
									);
	}
	var infjml = infos.append("button")
	.attr("class",function(){
		switch (orientasi){
		case 'negatif':
			return 'btn btn-danger btn-mini ';
		case 'positif':
			return 'btn btn-success btn-mini';
		case 'nonopini':
			return 'btn btn-warning btn-mini';
		}
	});
	infjml.append("text").text(jumlah + " tweet "+orientasi+" ");
	
}

function setInfoWaktuBlank(){
	var infos = d3.select("#infoCircle");
	var btns = infos.selectAll("button");
	btns.attr("class","btn btn-mini minwidth100 setopacity3").text("---");	
}


$("#setSlider").click(function(){
	defaultrentang = "#slider";
	var isactive = $("#setSlider").attr("class");
	if(isactive.indexOf("active")!= -1){
		$("#setSlider").attr("class",isactive);
	}else{
		$("#setSlider").attr("class",isactive+" active");
	}
	var set = $("#setDatepick").attr("class").replace("active","");
	$("#setDatepick").attr("class",set);
	//$("#ubahslider").removeAttr("disabled");
	//$(".tampilsetting").slideToggle(250);
});

$("#setDatepick").click(function(){
	defaultrentang = "#rentangdatepicker";
	var isactive = $("#setDatepick").attr("class");
	if(isactive.indexOf("active")!= -1){
		$("#setDatepick").attr("class",isactive);
	}else{
		$("#setDatepick").attr("class",isactive+" active");
	}
	var set = $("#setSlider").attr("class").replace("active","");
	$("#setSlider").attr("class",set);
	//$("#ubahslider").removeAttr("disabled");
	//$(".tampilsetting").slideToggle(250);
});

$("#ubahcalendar").click(function(){
	var dd1 = $("#calDate1").val()+" 00";
	var dd2 = $("#calDate2").val()+" 23";
	var passDomain = [dd1, dd2];
	passingDomain(passDomain,true);
	
	updatebarchart(
				   $("#calDate1").val(),
				   $("#calDate2").val()
				  );
    setInfoRentang(
    			   $("#calDate1").val(),
				   $("#calDate2").val()
					);
});
