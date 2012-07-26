<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
 	<script src="lib/jquery/jquery.js"></script>
	<script type="text/javascript" src="lib/d3/d3.v2.min.js"></script>
	<script type="text/javascript" src="lib/jquery/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.core.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.widget.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.mouse.js"></script>
	<script type="text/javascript" src="lib/jquery/jquery.ui.slider.js"></script>
	<script type="text/javascript" src="lib/tooltipsy.min.js"></script>
	<script type="text/javascript">
	$.getJSON("data/datelist.php", function(result) {
		
		var nm_bulan = new Array("Januari", "Februari", "Maret", 
		"April", "Mei", "Juni", "Juli", "Agustus", "September", 
		"Oktober", "November", "Desember");
		
    	var opt1 = $("#dates1"),
    		opt2 = $("#dates2");

		$.each(result, function() {
    	opt1.append($("<option />").val(this.date).text(Number(this.date.substr(8,2))+" "+nm_bulan[Number(this.date.substr(5,2))]));
    	opt2.append($("<option />").val(this.date).text(Number(this.date.substr(8,2))+" "+nm_bulan[Number(this.date.substr(5,2))]));
		});
				
		$("#dates2")[ 0 ].selectedIndex = 14;
	});
	
	$(function() {
			var select1 = $("#dates1");
			var select2 = $("#dates2");
			$("#slider").slider({
				range: true,
				min: 1, 
				max: 15,
				values: [ 1,15],
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
	$("#dates1").change(function() {
					var values = $( "#slider" ).slider( "option", "values" );
					console.log(values[0]);
					$("#slider").slider( "option","values", this.selectedIndex + 1 );
				});
	</script>
    <!-- Le styles -->
	<link type="text/css" href="css/overcast/jquery-ui-1.8.20.custom.css" rel="stylesheet" />	
    <link type="text/css" href="css/bootstrap.css" rel="stylesheet">
	<link type="text/css" href="css/barchart.css" rel="stylesheet">
	<link type="text/css" href="css/tipsy.css" rel="stylesheet">
	<link type="text/css" href="css/style-2.css" rel="stylesheet">
	<link type="text/css" href="css/charts.css" rel="stylesheet">
    <link href="css/bootstrap-responsive.css" rel="stylesheet">

    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->
    </head>

  <body>

    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#">Dashboard Visualization</a>
          <div class="nav-collapse">
            <ul class="nav">
              <li class="active"><a href="#">Main</a></li>
              <li><a href="#about">Tweets Viewer</a></li>
              <li><a href="#contact">About</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container dashboard">
    	<div class="linechart">
    		<div id="linechart">
			</div>
    	</div>
    	<div class="row">
    		
					<div id="bar" class="span4 barchart">
						
						<div class="judulchart">
							Perbandingan jumlah tweet tiap sentimen
						</div>
						<div class="slidercontainer" >
								Sejak   
							 	<select id="dates1" disabled>
								</select>
								hingga
								<select id="dates2" disabled>
								</select>
							<div id="slider" class="barslider"></div>
						</div>
					</div>
				
			</div>
    <!-- /row -->
    
    	
    	
     
    </div> <!-- /container -->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    
   
	<script src="chartjs/barchart.js"></script>
	<script src="chartjs/linechart.js"></script>
    <!--<script src="lib/bootstrap/bootstrap-transition.js"></script>
    <script src="lib/bootstrap/bootstrap-alert.js"></script>
    <script src="lib/bootstrap/bootstrap-modal.js"></script>
    <script src="lib/bootstrap/bootstrap-dropdown.js"></script>
    <script src="lib/bootstrap/bootstrap-scrollspy.js"></script>
    <script src="lib/bootstrap/bootstrap-tab.js"></script>
    <script src="lib/bootstrap/bootstrap-tooltip.js"></script>
    <script src="lib/bootstrap/bootstrap-popover.js"></script>
    <script src="lib/bootstrap/bootstrap-button.js"></script>
    <script src="lib/bootstrap/bootstrap-collapse.js"></script>
    <script src="lib/bootstrap/bootstrap-carousel.js"></script>
    <script src="lib/bootstrap/bootstrap-typeahead.js"></script>-->

  </body>
</html>