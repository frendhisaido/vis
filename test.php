<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>TWISAV Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
      
    <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon" />
    <link type="text/css" href="css/ss.css" rel="stylesheet"/>
    <link type="text/css" href="css/jquery-ui-1.8.20.custom.css" rel="stylesheet" />
    <link type="text/css" href="css/opentip.css" rel="stylesheet"/>
      
    <script type="text/javascript" src="lib/jquery/jquery-1.7.2.min.js"></script>  
    <script type="text/javascript" src="lib/jquery/jquery.ui.core.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.widget.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.mouse.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.slider.js"></script>
    <script type="text/javascript" src="lib/jquery/jquery.ui.datepicker.js"></script>
    <script type="text/javascript" src="lib/d3/d3.min.js"></script>
    <script type="text/javascript" src="lib/queue/queue.min.js"></script>
    <script type="text/javascript" src="lib/opentip/opentip.js"></script>
    <script type="text/javascript" src="lib/opentip/adapter.jquery.js"></script>
    <script type="text/javascript" src="njs/all.js"></script>
   
    </head>

  <body onload="initjs();">

      <div id="dashboard" class="">
          
            <div id="linebox" class="bordering lefting">
                
                <div id="linegraph" class="">
	               <div id="bar"></div>
                </div>
                <div id="linecontext" class="hide">
                </div>
                <div id="linecontrol" class="">
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
                </div>
            </div>
             
          
            <div id="tweetbox" class="bordering lefting">
                <div class="infobox">
                    <text id="infotanggal" class="tanggal">2 April</text> :<text id="infojumlah" class="jumlah">1108 tweet negatif</text>
                </div>
                <div class="content">
                </div>
            </div>
          
          
          <div id="searchbox" class="bordering lefting">
                 
                 <div class="infoboxsearch">
                    <div id="textinfosearch" class="lefting">
                        <input type="text"> <button class="stylebutton">cari</button>
                     </div>
                    <div id="pie" class="lefting">
                    </div>
                 </div>
                 
                 <div class="content">
                     		
                 </div>
            </div>
     
      </div>
<select id="dates1" class="hide" disabled></select>
<select id="dates2" class="hide" disabled></select>
	
	
    
  </body>
</html>