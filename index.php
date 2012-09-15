<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon" />
      
    <link type="text/css" href="css/jquery-ui-1.8.20.custom.css" rel="stylesheet" />	
    <link type="text/css" href="css/bootstrap.min.css" rel="stylesheet">
    <link type="text/css" href="css/bootstrap-responsive.css" rel="stylesheet">
    <link type="text/css" href="css/barchart.css" rel="stylesheet">
    <link type="text/css" href="css/style-2.css" rel="stylesheet">
    <link type="text/css" href="css/charts.css" rel="stylesheet">
    <!-- Le styles 
    <link type="text/css" href="http://localhost/vis/min/b=vis/css&f=barchart.css,style-2.css,charts.css" rel="stylesheet">
    <link type="text/css" href="http://localhost/vis/min/b=vis/css&f=jquery-ui-1.8.20.custom.css,bootstrap.css,bootstrap-responsive.css" rel="stylesheet" />
     --> 
     
    <script type="text/javascript" src="lib/d3/d3.v2.min.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="lib/bootstrap/bootstrap.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.core.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.widget.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.mouse.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.slider.js"></script>
    
     <!-- Le javascripts
     	<script type="text/javascript" src="lib/jquery/jquery.ui.draggable.js"></script>
     	<script type="text/javascript" src="http://localhost/vis/min/b=vis/lib&f=d3/d3.v2.min.js,jquery/jquery-1.7.2.min.js,bootstrap/bootstrap.min.js,jquery/jquery.ui.core.js,jquery/jquery.ui.widget.js,jquery/jquery.ui.mouse.js,jquery/jquery.ui.slider.js"></script>
    
    -->
	<script type="text/javascript">
		  
		  function initjs(){
		  
		  $('#buton').popover({trigger: 'hover',
				      placement: 'bottom',
				      delay: {show: 2500, hide: 500}});
		  $("#context").hide();
		  $(".show_hide").show();
 
		  $('#zoombutton').click(function(){
		      $("#context").slideToggle(250,unzoom);
		     });
		     
		  initbarchart();
		  initLineChart('perday',false);
		  //$("#controlers").draggable();
		  }
		
		 
		
		</script>
    

    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->
    </head>

  <body onload="initjs();">

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
	      <li><a href="#helps">Help</a></li>
            </ul>
          </div><!--/.nav-collapse -->
	  
        </div>
      </div>
    </div>

    <div class="container dashboard">
	<div class="row">
		  <div id="inforentang" class="span3">
									
				</div> 
				
	    <div class="span12 slidercontainer" >
								
							 	<select id="dates1" disabled>
								</select>
								<select id="dates2" disabled>
								</select>
							<div id="slider" class="barslider"></div>
						</div>
	    
	 <!-- 
	    <div id="contextbar"></div>
	  -->
	</div>
	
	
	<div class="row">
	  
	  <div class="span5">
	    <div id="linechart"></div>
	    <div id="context"></div>	
			
	  </div>
	  <div id="controlers" class="offset10 controlchart">
		
		 
		<button id="togglePositif" type="button" class="btn btn-success toggleview" data-toggle="button" onclick="toggleLine('positif')">
		  <i class="icon-plus-sign"></i> Positif</button> 
		</br>
		<button id="toggleNegatif" type="button" class="btn btn-danger toggleview" data-toggle="button" onclick="toggleLine('negatif')">
		  <i class="icon-minus-sign"></i> Negatif</button>
		</br>
		<button id="toggleNonopini" type="button" class="btn btn-warning toggleview" data-toggle="button" onclick="toggleLine('nonopini')">
		  <i class="icon-adjust"></i> Non-Opini</button>
		<div id="toggleMax" class="btn-group btn-group-vertical buttonPinggir" data-toggle="buttons-radio">
		  <button id="maxPos" type="button" class="btn btn-success" onclick="toggleMaxY('positif')"><i class="icon-plus-sign"></i></button>
		  <button id="maxNeg" type="button" class="btn btn-danger" onclick="toggleMaxY('negatif')"><i class="icon-minus-sign"></i></button>
		  <button id="maxnon" type="button" class="btn btn-warning" onclick="toggleMaxY('nonopini')"><i class="icon-adjust"></i></button>
		</div>
		<div class="buttonTengah">
		<button type="button" id="zoombutton" class="btn btn-info"
			style="width: 130px;"
			data-toggle="button"
			data-title="Fitur zoom"
			data-content="Fokus pada grafik dengan rentang tanggal tertentu.">
		<i class="icon-resize-horizontal"></i>
		  Zoom</button>
		 </div>
		 <div class="btn-group buttonTengah" data-toggle="buttons-radio">			
		  			<button style="width: 65px;padding-left: 5px;" type="button" class="btn" onclick="initLineChart('perday',true);">Per Hari</button>
		  			<button style="width: 65px;padding-left: 5px;" type="button" class="btn" onclick="initLineChart('perhour',true);">Per Jam</button>
		</div>
		<div id="infoCircle">
			
		</div>
		
	  
	  </div>
	</div>
	
    	<div class="row">
    		
					<div id="bar" class="span4 barchart">
						
					</div>
					<div class="span6">
					
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
	<script src="chartjs/contextbar.js"></script>
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