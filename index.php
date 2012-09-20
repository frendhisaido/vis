<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>TWISAV Dashboard</title>
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
		  
		  //$('#buton').popover({trigger: 'hover',
		  //		      placement: 'bottom',
		  //	      delay: {show: 2500, hide: 500}});
		  $("#context").hide();
 
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
          <a class="brand" href="#">TWISAV</a>
          <div class="nav-collapse">
            <ul class="nav">
              <li class="active"><a href="#">Dashboard</a></li>
              <li><a href="#tweets" >Tweets Viewer</a></li>
              <li><a href="#about" onclick="$('#modalabout').modal('show');">About</a></li>
	      	  <li><a href="#help" onclick="$('#modalhelp').modal('show');">Help</a></li>
            </ul>
          </div><!--/.nav-collapse -->
          <!-- search rede
	  	<form class="navbar-search pull-right">
  		<input type="text" class="search-query" placeholder="Search">
		</form>
		-->
        </div>
      </div>
    </div>

    <div class="container">
	<div class="row">
				<div class="widget-top span11">
							
						<div id="slider" class="widget-content inshadow">
						
						</div>
						 <div id="inforentang" class="span3"></div> 
				</div>
	    <div title="klik untuk ubah rentang tanggal">
							
							 	<select id="dates1" class="hide" disabled>
								</select>
								<select id="dates2" class="hide" disabled>
								</select>
							
		</div>
	 <!-- 
	 	<defs>

<filter id="drop-shadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0.5"/> 
                <feOffset dx="1" dy="1" result="offsetblur"/> 
                <feMerge> 
                    <feMergeNode/> 
                    <feMergeNode in="SourceGraphic"/> 
                </feMerge> 
</filter>

</defs>
	    <div id="contextbar"></div>
	  -->
	</div>
	
	
	<div class="row">
	  
	  <div class="widget-box span11">
	  	<div class="widget-title">
								<span class="icon">
									<i class="icon-file"></i>
								</span>
								<h5>Line Chart</h5>
							</div>
		<div class="widget-content inshadow">
	    <div id="linechart"></div>
	    
	    <div id="context"></div>	
	   </div>
			
	  </div>

	</div>
	
    	<div class="row-fluid">
    		
					
					
					<div class="widget-box span4">
							<div class="widget-title">
								<span class="icon">
									<i class="icon-file"></i>
									
								</span>
								<h5>Bar Chart</h5>
							</div>
							<div class="widget-content nopadding inshadow">
								<div id="bar"></div>			
							</div>
						</div>
						
						
						<div class="widget-box span3">
							<div class="widget-title">
								<span class="icon">
									<i class="icon-file"></i>
									
								</span>
								
							</div>
							<div class="widget-content nopadding inshadow">
								<div id="controlers" >
		
		 
		<button id="togglePositif" type="button" class="btn btn-success toggleview" data-toggle="button" onclick="toggleLine('positif')">
		  Positif</button> 
		<button type="button" class="btn" data-toggle="button" >
			<i class="icon-eye-open"></i></button>
		<button type="button" class="btn" data-toggle="button" >
			Y</button>
		</br>
		<button id="toggleNegatif" type="button" class="btn btn-danger toggleview" data-toggle="button" onclick="toggleLine('negatif')">
		   Negatif</button>
		<button type="button" class="btn" data-toggle="button" >
			<i class="icon-eye-open"></i></button>
		</br>
		<button id="toggleNonopini" type="button" class="btn btn-warning toggleview" data-toggle="button" onclick="toggleLine('nonopini')">
		  Non-Opini</button>
		<button type="button" class="btn" data-toggle="button" >
			<i class="icon-eye-open"></i></button>
		
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
						</div>
						
						  
					 
		</div>
					 
				
	</div>
   
   
    	
     
    </div> <!-- /container -->
    <!-- modals/ -->
						<div id="modalhelp" class="modal hide fade">
						  	<div class="modal-header">
						    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						    <h3>Dashboard help</h3>
						  </div>
						  <div class="modal-body">
						    <p>Cara menggunakan dijelaskan disini..</p>
						    <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.

Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.

Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.

Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
</p>
<div class="thumbnail span3 pull-left">
	
     <img src="img/buttons1.jpg" class="img-polaroid"/>
      <h3>Button view</h3>
      <p>Untuk...</p>

    </div>
      
    

<p>
Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.

Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.
Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.

Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.

Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.

Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.

Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.

Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
						  </div>
						</div>	
						
						<div id="modalabout" class="modal hide fade">
						  	<div class="modal-header">
						    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						    <h3>About TWISAV</h3>
						  </div>
						  <div class="modal-body">
						    <p>TWISAV adalah Twitter Sentiment Analysis Visualization</p>
						  </div>
						</div>			
	 <!-- /modals -->
	 
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