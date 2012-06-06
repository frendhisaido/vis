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
	
    <style>
    
    body{
    padding-top: 45px; /* 60px to make the container go all the way to the bottom of the topbar */  
    }
	.well{
	background-color: #EEE;
	padding-bottom: 5px;
	}
	.corner{
	position: absolute;
	float:left;
	margin-left: -12px;
	margin-top: -12px;
	}
	.marginleft{
	margin-left: -20px;
	}
	.linechart {
	padding: 0;
	border: 1px solid rgba(0, 0, 0, 0.05);
	margin-bottom: 10px;
	height: 350px;
	}
	.barchart {
	position: absolute;
	height: 350px;
	float: left;
	border: 1px solid #ddd;
		font-family: Helvetica;
	}
	.judulchart {
		font-size: 1.1em;
		padding: 5px 0px 5px 0px;
		text-align: center;
		background-color: #333;
		color: #FFFFFF;
	}
	.barslider {
		opacity: 0.9;
		margin-bottom: 10px;
	}
	.barslider:hover {
		opacity: 1;
	}
	.slidercontainer {
		padding-left: 15px;
		padding-right: 20px;
		padding-top: 2px;
		margin-bottom: 2px;
		text-align: center;
		font-size: 0.9em;
		border-bottom: 1px solid #ddd;
	}
	.slidercontainer select {
		cursor: default;
		width: 115px;
		-webkit-appearance: button;
		-webkit-padding-end: 0px;
		-webkit-padding-start: 2px;
		-webkit-user-select: none;
		background: transparent;
		border: 0px;
		color: #000;
		font-weight: bold;
		font-size: 1.5em;
		margin: 0;
		overflow: hidden;
		padding-top: 0px;
		padding-bottom: 5px;
		margin-bottom: 1px;
	}
	.gauge {
	border: 1px solid grey;
	min-height: 270px;
	float: left;
	}
	.keywords {
	border: 1px solid grey;
	min-height: 270px;
	margin-left: 5px;
	margin-right: 5px;
	float: right;
	}
	.footer {
	background-color: grey;
	min-width: 1100px;
	height: 10%;
	}

    </style>
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
    	<div class="hero-unit linechart">
    		<!--<script src="chartjs/linechart.js"></script>-->
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