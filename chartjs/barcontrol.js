var totaldates = 0;
$.getJSON("data/datelist.php", function(result) {
	totaldates = result.length;
		
	var nm_bulan = new Array("Januari", "Februari", "Maret", 
	"April", "Mei", "Juni", "Juli", "Agustus", "September", 
	"Oktober", "November", "Desember");
	
		var select1 = $("#dates1");
		var select2 = $("#dates2");


	$.each(result, function() {
	select1.append($("<option />").val(this.date).text(Number(this.date.substr(8,2))+" "+nm_bulan[Number(this.date.substr(5,2))]));
	select2.append($("<option />").val(this.date).text(Number(this.date.substr(8,2))+" "+nm_bulan[Number(this.date.substr(5,2))]));
	});
			
	$("#dates2")[ 0 ].selectedIndex = totaldates-1;
		
			$("#slider").slider({
				max : totaldates,
				min : 1,
				values : [1,totaldates],
				range: true,
				slide: function( event, ui ) {
					select1[ 0 ].selectedIndex = ui.values[0] -1;
					select2[ 0 ].selectedIndex = ui.values[1] -1;
				},
				stop: function( event, ui ) {
					updatebarchart(
						$("#dates1 option:selected").val(),
						$("#dates2 option:selected").val()
					);
				}
			});
});

$(function() {

	});
$("#dates1").change(function() {
				var values = $( "#slider" ).slider( "option", "values" );
				console.log("values[0]",values[0]);
				$("#slider").slider( "option","values", this.selectedIndex + 1 );
			});