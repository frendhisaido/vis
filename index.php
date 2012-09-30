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
		  var tog = [
		  	{ orn: "negatif",eye: "#negeye", id: "#toggleNegatif", view : true},
		  	{ orn: "positif",eye: "#poseye", id: "#togglePositif", view : true},
		  	{ orn: "nonopini",eye: "#noneye", id: "#toggleNonopini", view : true}
		  ];
		  //override array hari untuk axis x
		  d3_time_weekdays = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
		  
		  
		  
		  function initjs(){
		  
		  
		  //$('#buton').popover({trigger: 'hover',
		  //		      placement: 'bottom',
		  //	      delay: {show: 2500, hide: 500}});
		  $("#context").hide();
		  $("#slider").hide();
		  
		  
 		  var negopen = true,posopen = true,nonopen = true;
 		  $("#toggleNegatif").click(function(){
 		  	toggleLine("negatif");
 		  	if(tog[0].view){
	 		  	$(tog[0].eye).attr("class","icon-eye-close");
	 		  	tog[0].view = false; 
	 		  	}else{
	 		  	$(tog[0].eye).attr("class","icon-eye-open");
	 		  	tog[0].view = true;  	
 		  	}
 		  	isAlone();		  	
 		  });
 		   $("#togglePositif").click(function(){
 		  	toggleLine("positif");
 		  	if(tog[1].view){
	 		  	$(tog[1].eye).attr("class","icon-eye-close");
	 		  	tog[1].view = false; 
	 		  	}else{
	 		  	$(tog[1].eye).attr("class","icon-eye-open");
	 		  	tog[1].view = true;
 		  	}
 		  	isAlone();  	
 		  });
 		   $("#toggleNonopini").click(function(){
 		  	toggleLine("nonopini");
	 		if(tog[2].view){
	 		  	$(tog[2].eye).attr("class","icon-eye-close");
	 		  	tog[2].view = false; 
	 		  	}else{
	 		  	$(tog[2].eye).attr("class","icon-eye-open");
	 		  	tog[2].view = true;
	 		  }
	 		  isAlone();  	
 		  });
 		  
 		  function isAlone(){
 		  	var countrue=0;
 		  	var alone=0;
 		  	for (i=0; i < tog.length; i++){
 		  		if(tog[i].view == true){
 		  			countrue++;
 		  		}
 		  	}
 		  	if(countrue == 1){
 		  		for (i=0; i < tog.length; i++){
 		  			if(tog[i].view == true){
 		  			$(tog[i].id).attr("disabled","");
 		  			toggleMaxY(tog[i].orn);
 		  			}
 		  		}
 		  	}
 		  	if(countrue >1){
 		  		$("#viewcontrols button").removeAttr("disabled");
 		  		toggleMaxY("default");
 		  	}
 		  }
 		  
 		  
 		  
		  $("#zoombutton").click(function(){
		      $("#context").slideToggle(250,unzoom);
		     });
		     
		  $("#ubahrentang").click(function(){
		      $("#slider").slideToggle(250);
		     });
		  initbarchart();
		  initLineChart('perday',false);
		  //$("#controlers").draggable();
		  }
		
		 
		
		</script>
    

    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]
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
              <li><a href="#about" onclick="$('#modalabout').modal('show');">Tentang TWISAV</a></li>
	      	  <li><a href="#help" onclick="$('#modalhelp').modal('show');">Bantuan</a></li>
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
							 	<select id="dates1" class="hide" disabled>
								</select>
								<select id="dates2" class="hide" disabled>
								</select>
	<div class="row">
	  
	  <div id="linecontainer" class="widget-box span12 box-shadow">
	  	<div class="widget-title">
								<span class="icon">
									<i class="icon-signal"></i>
								</span>
								
								<div class="buttons btn-group">
								<button type="button" id="zoombutton" class="btn btn-mini btn-info topButton"
									data-toggle="button"
									data-title="Fitur zoom"
									data-content="Fokus pada grafik dengan rentang tanggal tertentu.">
								Zoom</button>
								 </div>
								 <div class="buttons btn-group" data-toggle="buttons-radio">			
		  						<button type="button" class="btn btn-mini topButton" onclick="initLineChart('perday',true);">Per Hari</button>
		  						<buttontype="button" class="btn btn-mini topButton" onclick="initLineChart('perhour',true);">Per Jam</button>
								</div>
								<div id="viewcontrols" class="buttons">
										<button id="toggleNegatif" type="button" class="btn btn-mini" data-toggle="button">
										   <i id="negeye" class="icon-eye-open"></i> Negatif</button>
										
										<button id="togglePositif" type="button" class="btn btn-mini" data-toggle="button">
										  <i id="poseye" class="icon-eye-open"></i> Positif</button> 
										
										<button id="toggleNonopini" type="button" class="btn btn-mini" data-toggle="button">
										  <i id="noneye" class="icon-eye-open"></i> Non-Opini</button>
	  							 </div>
								<button id="ubahrentang" class="buttons btn btn-mini" data-toggle="button" title="klik untuk tampil atau sembunyikan slider">Ubah</button>
								<h5><text id="inforentang" 
									class="inforentang textUnselectable"></text>
								</h5>
								
								
														
		</div>
		<div class="widget-content">
		
			<div id="sliderentang" >			
				<div id="slider" class="widget-content inshadow"></div>		
			</div>
		
	    <div id="linechart">
	    	
	    	
	    </div>
	    <div id="context"></div>	
	   </div>
	   
			
	  </div>

	</div>
	
    	<div class="row-fluid">
    		
					
					<div id="barcontainer" class="span4">
					<div class="widget-box box-shadow">
							<div class="widget-title">
								<span class="icon">
									<i class="icon-tasks"></i>
									
								</span>
								<h5><text id="inforentang"></text> ( <text id="totaltweet"></text> tweet )</h5>
								
							</div>
							<div class="widget-content nopadding">
								<div id="bar"></div>			
							</div>
						</div>
						</div>
						
						<div class="span8">
						<div class="widget-box box-shadow">
							<div class="widget-title">
								<span class="icon">
									<i class="icon-file"></i>
								</span>
								<div id="infoCircle" class="btn-group buttons">
						    		<button class="btn btn-mini minwidth100">---</button>
						    		<button class="btn btn-mini minwidth100">---</button>
						    	</div>
						    	<h5>
						    		|<div class="input-append">
  										<input class="minwidth100" id="appendedInputButton" size="16" type="text"><button class="btn" type="button">Go!</button>
									</div>
						    	</h5>
							</div>
							<div class="widget-content  nopadding">
								<div id="tweetcontainer">
								
								
								  
								</div>
					</div>	 
						</div>
						
					 
	</div><!-- /container -->
    
    <!-- modals/ -->
						<div id="modalhelp" class="modal hide fade">
						  	<div class="modal-header">
						    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						    <h3>Dashboard help</h3>
						  </div>
						  <div class="modal-body">
						    <blockquote>
  <p>Penjelasan mengenai fitur-fitur di dashboard ini.</p>
</blockquote>
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