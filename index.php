<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
	<script type="text/javascript" src="lib/d3/d3.v2.js"></script>
    <!-- Le styles -->
    <link href="css/bootstrap.css" rel="stylesheet">
    <style>
      body {
        padding-top: 45px; /* 60px to make the container go all the way to the bottom of the topbar */
      }
      	.dashboard {
		min-width: 1300px;
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
		border: 1px solid rgba(0, 0, 0, 0.05);
		margin-bottom: 5px;
		height: 300px;
		}
		.barchart {
		min-height: 270px;
		float: left;
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
		.axis {
		  shape-rendering: crispEdges;
		}
		.axis path {
		  fill: none;
		}
		.xaxis line {
		  stroke: #000;
		  stroke-opacity: .8;
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
        <div class="container" >
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
    	
    	</div>
    	<div class="row">
    		
					<div id="bar" class="span4 barchart well">
					<span class="label label-info corner">Info</span>
						<script src="chartjs/barchart.js"></script>
					</div>
					
					<div class="span5 marginleft well">
					.
					</div>
				
			</div>
    <!-- /row -->
    
    	
    	
     
    </div> <!-- /container -->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    
    <script src="lib/jquery/jquery.js"></script>
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