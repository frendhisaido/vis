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
    <script type="text/javascript" src="lib/jquery/jquery.ui.datepicker.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.draggable.js"></script>
    <script type="text/javascript" src="chartjs/init.js"></script>
    
     <!-- Le javascripts
     	<script type="text/javascript" src="lib/jquery/jquery.ui.draggable.js"></script>
     	<script type="text/javascript" src="http://localhost/vis/min/b=vis/lib&f=d3/d3.v2.min.js,jquery/jquery-1.7.2.min.js,bootstrap/bootstrap.min.js,jquery/jquery.ui.core.js,jquery/jquery.ui.widget.js,jquery/jquery.ui.mouse.js,jquery/jquery.ui.slider.js"></script>
    
    -->
	<script type="text/javascript">
		  $(function() {
               // $("#bar").draggable({ 
               //                         opacity: 0.35,
               //                         zIndex: 9000 });
            });
		</script>
    

    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->
    </head>

  <body onload="initjs();">

 

    <div class="container" >				
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
									data-title="Fitur context viewer"
									data-content="Fokus pada grafik dengan rentang tanggal tertentu.">
								Context</button>
								 </div>
								 <div class="buttons btn-group" >			
		  						<!--<button type="button" class="btn btn-mini topButton" onclick="initLineChart('perday',true);">Per Hari</button>
		  						<button type="button" class="btn btn-mini topButton" onclick="initLineChart('perhour',true);">Per Jam</button>
		  						-->
		  						<a class="btn btn-mini dropdown-toggle" data-toggle="dropdown" href="#">
		  						    <text id="infoSatuanWaktu">Hari</text>
		  						    <span class="caret"></span>
		  						</a>
		  						<ul class="dropdown-menu">
		  						    <li><a href="#" onclick="initLineChart('perhour',true);" >Per Jam</a></li>
		  						</ul>
								</div>
								<div id="viewcontrols" class="buttons">
										<button id="toggleNegatif" type="button" class="btn btn-mini" data-toggle="button">
										   <i id="negeye" class="icon-eye-open"></i> Negatif</button>
										
										<button id="togglePositif" type="button" class="btn btn-mini" data-toggle="button">
										  <i id="poseye" class="icon-eye-open"></i> Positif</button> 
										
										<button id="toggleNonopini" type="button" class="btn btn-mini" data-toggle="button">
										  <i id="noneye" class="icon-eye-open"></i> Non-Opini</button>
	  							 </div>
	  							<div class="buttons btn-group btnrentang" >
		  							<button id="ubahRentang" class="btn btn-mini" title="klik untuk sembunyikan pengubah rentang"><i id="rentangeye" class="icon-eye-open"></i> Rentang</button>
									<button id="setSlider" type="button" class="btn btn-info btn-mini tampilsetting hide" >slider</button>
									<button id="setDatepick" type="button" class="btn btn-info btn-mini tampilsetting hide active" >date picker</button>
									<button id="settingRentang" class="btn btn-mini" title="klik untuk atur perubah rentang"><i class="icon-cog"></i></button>
								</div>
								<h5><text id="inforentang" 
									class="inforentang textUnselectable"></text>
								</h5>
								
														
		</div>
		<div class="widget-content">
		    
									<div id="rentang" class="inshadow">
									    <div id="datepick">
										<input type="text" id="calDate1" name="from" placeholder="Dari.."/>
										<input type="text" id="calDate2" name="to" placeholder="Hingga.."/>
										<button id="ubahcalendar" class="btn">Ubah</button>
										</div>
										<div id="slidepick" class="hide">
										<div id="slider" class="widget-content inshadow"></div>
										</div>       
									</div>
			
		      
        <div id="miscinfo">
        <table class="table table-hover table-bordered">
        <tbody>
        
         <tr>
              <td class="infolabel">Brand</td>
              <td>Indosat</td>
         </tr>
         <tr>
              <td id="infonegatif" class="negatif">Negatif</td>
              <td> 288262 </td>
         </tr>
          <tr>
              <td id="infopositif" class="positif">Positif</td>
              <td> 288262 </td>
         </tr>
          <tr>
              <td id="infonon" class="nonopini">Non-Opini</td>
              <td> 288262 </td>
         </tr>
          <tr>
              <td class="infolabel">Keyword tertinggi</td>
              <td> pending </td>
         </tr>
          <tr>
              <td class="infolabel">Jam tersibuk</td>
              <td> 13:78 </td>
         </tr>
          <tr>
              <td class="infolabel">Hari tersibuk</td>
              <td> 28-08-02 </td>
         </tr>
    
                </tbody>
        </table>
        </div>
        
        
	    <div id="linechart">
	    	
	    	<div id="bar"></div>
	    </div>
	    <div id="context" class="hide"></div>
	    	
	   </div>
	   
			
	  </div>

	</div>
	
    	<div class="row-fluid">
    		
					
					<div id="barcontainer" class="span5">
					<div class="widget-box box-shadow">
							<div class="widget-title">
								<span class="icon">
									<i class="icon-search"></i>
									
								</span>
								<h5>: </h5>            

								 <form id="search" class="navbar-form  pull-right">
                                    <input id="searchkeyword" type="text" class="search-query deletable" placeholder="Masukan keyword...">
                                 </form>
							</div>
							<div class="widget-content nopadding">
							    <div class="infoTweetViewer">
                                           <small> Ditemukan <strong><text id="totalFound">______</text></strong> tweet yang mengandung keyword <strong><text id="keywordtitle">______</text></strong>.</small>
							                   <div id="pie" class="inshadow"></div>
							    </div>
									<div id="keywordresult" class="tweetviewer">
                                        
                                    </div>		
							</div>
						</div>
						</div>
						
						<div class="span7">
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
						    		| Keyword: <i><text id="fullkeyword"></text></i>
						    	</h5>
						    	<!--
						    	<div id="searchkeyword" class="input-append minwidth100">
  										<input id="appendedInputButton" size="16" type="text"><button class="btn" type="button">Go!</button>
								</div>
								-->
							</div>
							<div class="widget-content  nopadding">
							     <div  class="infoTweetViewer">
                                           <small> Hasil pencarian: pending. Ditemukan 2873 tweet.</small>
                                     
                                </div>
								<div id="tweetcontainer" class="tweetviewer">
								<div class="alert alert-info">
  									Klik pada lingkaran di line chart untuk menampilkan tweet disini.
  									
								</div>
								  <div class="loadingtweet">  </div>
								</div>
					</div>	 
						</div>
						
					 
	</div>
		</div><!-- /secondrow-->
	</div><!-- /container -->
	
	    <!-- modals/ -->
    <div id="modaltweetkw" class="modal hide fade">
						  	<div class="modal-header">
						    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						    <h3 id="titlekeywordresult">Keyword : <i><text id="keywordtitle"></text></i></h3>
						  </div>
						  <div class="modal-body">
						  	
						 </div>
	</div>	
						
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
	<script src="chartjs/misc.js"></script>
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