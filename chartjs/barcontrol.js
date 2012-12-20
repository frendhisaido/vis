
function initSlider(){
		var select1 = $('#dates1');
		var select2 = $('#dates2');
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
					//console.log(passDomain);
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

function setInfoRentang(date1,date2) {
	var infos = d3.selectAll('#inforentang');
	infos.selectAll('text').remove();
	date1 = Number(date1.substr(8, 2)) + ' '+ gc.nama_bulan[Number(date1.substr(5, 2))];
	date2 =	Number(date2.substr(8, 2)) + ' '+ gc.nama_bulan[Number(date2.substr(5, 2))];
	if (date1 != date2) {
	 infos.append('text').text('Sejak ');
	 infos.append('text').attr('class', 'textrentang').text(date1);
	 infos.append('text').text(' hingga ');
	 infos.append('text').attr('class', 'textrentang').text(date2);
	}else {
	 infos.append('text').text('Pada ');
	 infos.append('text').attr('class', 'textrentang').text(date1);
	}
}

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
