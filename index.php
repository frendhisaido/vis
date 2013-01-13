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
    <link type="text/css" href="css/bootstrap.min.css" rel="stylesheet"/>
    <link type="text/css" href="css/style.css" rel="stylesheet"/>
    <link type="text/css" href="css/charts.css" rel="stylesheet"/>
    <link type="text/css" href="css/opentip.css" rel="stylesheet"/>
    
    <!-- Le styles 
    <link type="text/css" href="http://localhost/vis/min/b=vis/css&f=barchart.css,style-2.css,charts.css" rel="stylesheet">
    <link type="text/css" href="http://localhost/vis/min/b=vis/css&f=jquery-ui-1.8.20.custom.css,bootstrap.css,bootstrap-responsive.css" rel="stylesheet" />
     --> 
     
    <script type="text/javascript" src="lib/d3/d3.min.js"></script>
    <script type="text/javascript" src="lib/queue/queue.min.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="lib/bootstrap/bootstrap.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.core.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.widget.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.mouse.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.slider.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.datepicker.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.draggable.js"></script>
    <script type="text/javascript" src="lib/opentip/opentip.js"></script>
    <script type="text/javascript" src="lib/opentip/adapter.jquery.js"></script>
    
     <!-- Le javascripts
     	<script type="text/javascript" src="lib/jquery/jquery.ui.draggable.js"></script>
     	<script type="text/javascript" src="http://localhost/vis/min/b=vis/lib&f=d3/d3.v2.min.js,jquery/jquery-1.7.2.min.js,bootstrap/bootstrap.min.js,jquery/jquery.ui.core.js,jquery/jquery.ui.widget.js,jquery/jquery.ui.mouse.js,jquery/jquery.ui.slider.js"></script>
    
    -->
    

    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->
    </head>

  <body onload="initjs();">
      <select id="dates1" class="hide" disabled></select>
      <select id="dates2" class="hide" disabled></select>
 


<div id="dashboard">
    <div id="linebox" class="">
        <div class="infobox">
            <div id="bar"></div>
             <text id="inforentang" class="inforentang textUnselectable"></text>
             <div id="slidepick" class="hide">
                               <div id="slider" class="widget-content inshadow"></div>
                          </div> 
            
        </div>
          
        <div id="linegraph"></div>
        
        
        <div id="linecontext" class="hide"></div>
        
           <div id="linecontrol" class="">
                
                 <div id="rentang" class="lefting">
                           <div id="datepick">
                                            <input type="text" id="calDate1" name="from" placeholder="Dari.."/>
                                            <input type="text" id="calDate2" name="to" placeholder="Hingga.."/>
                                            <button id="ubahcalendar" class="btn">Ubah</button>
                          </div>
                </div>
                 <div id="contexttoggle" class="lefting">
                    <button type="button" id="zoombutton" class="btn btn-info" data-toggle="button"> Context</button>
                </div>   
                <div id="viewcontrols" class="lefting">
                                            <button id="toggleNegatif" type="button" class="btn" data-toggle="button">
                                               <i id="negeye" class="icon-eye-open"></i> Negatif</button>
                                            
                                            <button id="togglePositif" type="button" class="btn " data-toggle="button">
                                              <i id="poseye" class="icon-eye-open"></i> Positif</button> 
                                            
                                            <button id="toggleNonopini" type="button" class="btn" data-toggle="button">
                                              <i id="noneye" class="icon-eye-open"></i> Non-Opini</button>
                </div>
                
                          
                 
                 <div id="rentangsetting" class="btn-group lefting" >
                                        <button id="ubahRentang" class="btn" title="klik untuk sembunyikan pengubah rentang"><i id="rentangeye" class="icon-eye-open"></i> Rentang</button>
                                        <button id="setSlider" type="button" class="btn btn-info  tampilsetting hide" >slider</button>
                                        <button id="setDatepick" type="button" class="btn btn-info  tampilsetting hide active" >date picker</button>
                                        <button id="settingRentang" class="btn" title="klik untuk atur perubah rentang"><i class="icon-cog"></i></button>
                 </div>                          
                     <div id="timetoggles" class="btn-group lefting" >  
                                    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                                        <text id="infoSatuanWaktu">Hari</text>
                                        <span class="caret"></span>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a href="#" onclick="initLineChart('perhour',true);" >Per Jam</a></li>
                                        <li><a href="#" onclick="initLineChart('perday',true);" >Per Hari</a></li>
                                    </ul>
                        </div> 
           </div>
      
      </div>
    
    
</div>	  

			
		      
      
        
        <div class="hide" >
                  <strong>Negatif <text id="maxNegatifInfo">0</text></strong>
                  <strong>Positif <text id="maxPositifInfo">0</text></strong>
                  <strong>Non-opini <text id="maxNonopiniInfo">0</text></strong>
        </div>
        
     
			
	  
      

    
				
								 <form id="search" class="navbar-form  pull-right">
                                    <input id="searchkeyword" type="text" class="search-query deletable" placeholder="Masukan keyword...">
                                 </form>
				
							    <div class="infoTweetViewer">
                                           <small> Ditemukan <strong><text id="totalJum">______</text></strong> tweet yang mengandung keyword <strong><text id="keywordtitle">______</text></strong>.</small>
							                   <div id="pie" class="inshadow"></div>
							    </div>
									<div id="keywordresult" class="tweetviewer">
                                        
                                    </div>	
						
		
								<div id="infoCircle" class="btn-group buttons">
						    		<button class="btn btn-mini minwidth100">---</button>
						    		<button class="btn btn-mini minwidth100">---</button>
						    	</div>
						    		| Keyword:<text id="fullkeyword"></text>
								<div id="tweetcontainer" class="tweetviewer">
								  <div class="loadingtweet">  </div>
								</div> 
						
						
					 

	
	    <!-- modals/ -->
	
	 <div id="modaloverview" class="modal overview hide fade">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h3> Peringkat keyword </h3>
                            </div>
         <div class="modal-body">
                                <div id="keywordoverview">
                                    <div id="kwdistribution" class="overviewinside">
                                        <p id="overviewtext"> 
                                        </p>
                                    </div>
                                    <div class="insideone modalul">
                                    <h3>Data Set</h3>
                                        <div id="kwlistdataset">
                                        
                                        </div>
                                    </div>
                                    <div class="insidetwo modalul">
                                    <h3>Negatif</h3>
                                        <div id="kwlistnegatif">
                                      
                                        </div>
                                    </div>
                                    <div class="insidethree modalul">
                                        <h3>Positif</h3>
                                        <div id="kwlistpositif">
                                        
                                        </div>
                                    </div>
                                    <div class="insidefour modalul">
                                        <h3>Non-Opini</h3>
                                        <div id="kwlistnonopini">
                                        
                                        </div>
                                    </div>
                                    
                                </div>
                                <p id="infokeywordoverview">
                                        Di atas adalah informasi peringkat keyword berdasarkan kepopulerannya.
                                        Kepopuleran keyword dihitung berdasarkan jumlah tweet yang menyebut keyword tersebut.
                                        <strong>Klik tiap keyword untuk melihat jumlah tweet yang menyebut keyword tersebut di tiap tanggal.  </strong>
                                    </p>
         </div><!-- END Modal body -->
    </div><!-- END Modal Overview -->

	
	 <!-- /modals -->
    <!-- Le javascript
    
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
	
	<script src="njs/all.js"></script>
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