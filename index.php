<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <script type="text/javascript" src="lib/d3/d3.v2.min.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.core.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.widget.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.mouse.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.slider.js"></script>
    <script type="text/javascript" src="lib/bootstrap/bootstrap.js"></script>
    <!-- Le styles -->
    <link type="text/css" href="css/overcast/jquery-ui-1.8.20.custom.css" rel="stylesheet" />	
    <link type="text/css" href="css/bootstrap.css" rel="stylesheet">
    <link type="text/css" href="css/barchart.css" rel="stylesheet">
    <link type="text/css" href="css/style-2.css" rel="stylesheet">
    <link type="text/css" href="css/charts.css" rel="stylesheet">
    <link type="text/css" href="css/bootstrap-responsive.css" rel="stylesheet">

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
	
	<div class="row">
	  <div class="span5">
	    <div id="linechart"></div>
	    <div id="context"></div>	
			
	  </div>
	  <div class="span2 offset5">
		<script type="text/javascript">
		  $(document).ready(function(){
 
		  $("#context").hide();
		  $(".show_hide").show();
 
		  $('#buton').click(function(){
		      $("#context").slideToggle();
		     });
 
		  });
		</script>
		
		<button type="button" class="btn" data-toggle="button"><i class="icon-plus-sign"></i> Positif</button></br>
		<button type="button" class="btn" data-toggle="button"><i class="icon-minus-sign"></i> Negatif</button></br>
		<button type="button" class="btn" data-toggle="button"><i class="icon-adjust"></i> Non-Opini</button></br>
		<button type="button" id="buton" class="btn" data-toggle="button">Zoom</button>
		
	  
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
   
    
    	
    	
     
    </div> <!-- /container -->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    
	<script src="chartjs/linechart.js"></script>
	<script src="chartjs/barchart.js"></script>
	<script src="chartjs/barcontrol.js"></script>
	<!--
    <script src="lib/bootstrap/bootstrap-transition.js"></script>
    <script src="lib/bootstrap/bootstrap-alert.js"></script>
    <script src="lib/bootstrap/bootstrap-modal.js"></script>
    <script src="lib/bootstrap/bootstrap-dropdown.js"></script>
    <script src="lib/bootstrap/bootstrap-scrollspy.js"></script>
    <script src="lib/bootstrap/bootstrap-tab.js"></script>
    <script src="lib/bootstrap/bootstrap-tooltip.js"></script>
    <script src="lib/bootstrap/bootstrap-popover.js"></script>
    
    <script src="lib/bootstrap/bootstrap-collapse.js"></script>
    <script src="lib/bootstrap/bootstrap-carousel.js"></script>
    <script src="lib/bootstrap/bootstrap-typeahead.js"></script>-->

  </body>
</html>