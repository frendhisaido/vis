 <?php
include 'mysqlconfig.php';
include 'makegzip.php';
ob_start();
ob_implicit_flush(0);

$orientasi = $_GET['or'];
$tanggal = $_GET['tg'];
$full = $_GET['full'];
$atom = $_GET['atom'];
$keywords = $_GET['kw'];
$rowscount = $_GET['rc'];
$page = $_GET['pg'];
$top = $_GET['top'];

@mysql_select_db($dsn) or die( "Unable to select database");

if(!(isset($top))){
if(!(isset($rowscount))){
$checkcount = mysql_query("SELECT COUNT(IF
		(MATCH (orientasi,content) AGAINST ('$keywords'), 1, NULL)) as count
		FROM `dataset` 
		WHERE DATE_FORMAT( DATETIME,  '%Y-%m-%d' ) =  '$tanggal'
		AND orientasi = '$orientasi'");
$rowscount= mysql_result($checkcount, 0);
}
if (!(isset($page))) { 
 $page = 0; 
 } 
 
 $limitrows = 8;


		?>
		<table class="table table-hover">
		<tbody >
		
		<?php
		
		if($atom == 'perday'){
		$query = "SELECT DATE_FORMAT( DATETIME,  '%H:%i' ) AS jam,
				content,
				MATCH (orientasi,content) AGAINST ('$keywords') as cocok
				FROM `dataset` 
				WHERE DATE_FORMAT( DATETIME,  '%Y-%m-%d' ) =  '$tanggal'
				AND orientasi = '$orientasi'
				ORDER BY cocok DESC
				LIMIT $page,$limitrows"; 
		}else{
		$query = "SELECT DATE_FORMAT( DATETIME,  '%H:%i' ) AS jam,
				content,
				MATCH (orientasi,content) AGAINST ('$keywords') as cocok
				FROM `dataset` 
				WHERE DATE_FORMAT( DATETIME,  '%Y-%m-%d %H' ) =  '$tanggal'
				AND orientasi = '$orientasi'
				ORDER BY cocok DESC
				LIMIT $page,$limitrows";	
		}
		$numbers = $page+1;
		$result = mysql_query($query);
		while ($row = mysql_fetch_assoc($result)) { 
		 ?>
		 <tr id="tweets">
		      <td class="jamtweet"><?php echo $row["jam"]; ?></td>
		      <td><?php echo $row["content"]; ?></td>
		      <td class="numbtweet"><small>[<?php echo $numbers; ?>]</small></td>
		 </tr>
		 <?php
		 $numbers++;
		};
		?>
		</tbody>
		</table>
		<?php
		if($rowscount>6){
			if($atom=='perhour'){
				$tanggal = str_replace(" ", "%20", $tanggal);
			}
			//echo "rc:".$rowscount;
			$isover = $page + $limitrows;
			$isless = $page - $limitrows;
			//echo " isov:".$isover;
			//echo " isls:".$isless;
			
				if($isover<$rowscount){
					$nextpage = $page + $limitrows;
					$nexturl = "data/gettweets.php?tg=$tanggal&or=$orientasi&rc=$rowscount&pg=$nextpage&atom=$atom&kw=$keywords";
					$nextonclick =  "\$('#tweetcontainer').html('<h1>LOADING</h1>').load('$nexturl');";
					$nextstyle = "";
					$nextlabel = ">>";
				}else{
					$nextstyle = "background-color: #ddd";
					$nextonclick = "";
					$nextlabel = "||";
				}
				if($isless>=$limitrows || $isless==0){
					$prevpage = $page - $limitrows;
					$prevurl = "data/gettweets.php?tg=$tanggal&or=$orientasi&rc=$rowscount&pg=$prevpage&atom=$atom&kw=$keywords";
					$prevonclick =  "\$('#tweetcontainer').html('<h1>LOADING</h1>').load('$prevurl');";
					$prevstyle = "";
					$prevlabel = "<<";
				}else{
					$prevstyle = "background-color: #ddd";
					$prevonclick = "";
					$prevlabel = "||";
				}
		?>
		<div id="pagingbutton" class="pagination pagination-centered">
									  <ul>
									  	<li><a href="#" onclick="<?php echo $prevonclick;?>" style="<?php echo $prevstyle;?>">
									  		<?php echo $prevlabel;?>
									  		</a>
									    </li>
									    <li><a href="#" onclick="<?php echo $nextonclick;?>" style="<?php echo $nextstyle;?>">
									    	<?php echo $nextlabel;?>
									    	</a>
									    </li>
									  </ul>
		</div>
			
		<?php
		}
	}elseif((isset($top))){
		$query= mysql_query("SELECT count(*) FROM `dataset`
		WHERE content LIKE '%$keywords%'");
		$rowscount = mysql_result($query, 0);
		if($rowscount>1){
	?>
		<table class="table">
		<tbody >	
	<?php
		$query = mysql_query("SELECT DATE_FORMAT(datetime,'%e/%b %H:%i') 
		as tanggal,content,orientasi FROM `dataset` 
		WHERE content LIKE '%$keywords%' ORDER BY tanggal ASC
		LIMIT 0,20");
		
		//$numbers = $page+1;
		while ($row = mysql_fetch_assoc($query)) {
				/*
			switch ($row["orientasi"]) {
				case 'negatif':
					$trclass = "error";
					break;
				case 'positif':
					$trclass = "success";
					break;
				case 'nonopini':
					$trclass = "warning";
					break;
				default:
					
					break;
			}
			*/
			 
		 ?>
		 <tr id="tweets">
		      <td class="jamtweet"><?php echo $row["tanggal"];?></td>
		      <td class="<?php echo $row["orientasi"]; ?>"><?php echo $row["content"];?></td>
		 </tr>
		 <?php
		// $numbers++;
		};
		
		?>
		</tbody>
		</table>
		<?php
		/*
		if($rowscount>6){
			if($atom=='perhour'){
				$tanggal = str_replace(" ", "%20", $tanggal);
			}
			//echo "rc:".$rowscount;
			$isover = $page + $limitrows;
			$isless = $page - $limitrows;
			//echo " isov:".$isover;
			//echo " isls:".$isless;
			
				if($isover<$rowscount){
					$nextpage = $page + $limitrows;
					$nexturl = "data/gettweets.php?tg=$tanggal&or=$orientasi&rc=$rowscount&pg=$nextpage&atom=$atom&kw=$keywords";
					$nextonclick =  "\$('#tweetcontainer').html('<h1>LOADING</h1>').load('$nexturl');";
					$nextstyle = "";
					$nextlabel = ">>";
				}else{
					$nextstyle = "background-color: #ddd";
					$nextonclick = "";
					$nextlabel = "||";
				}
				if($isless>=$limitrows || $isless==0){
					$prevpage = $page - $limitrows;
					$prevurl = "data/gettweets.php?tg=$tanggal&or=$orientasi&rc=$rowscount&pg=$prevpage&atom=$atom&kw=$keywords";
					$prevonclick =  "\$('#tweetcontainer').html('<h1>LOADING</h1>').load('$prevurl');";
					$prevstyle = "";
					$prevlabel = "<<";
				}else{
					$prevstyle = "background-color: #ddd";
					$prevonclick = "";
					$prevlabel = "||";
				}
		?>
		<div id="pagingbutton" class="pagination pagination-centered">
									  <ul>
									  	<li><a href="#" onclick="<?php echo $prevonclick;?>" style="<?php echo $prevstyle;?>">
									  		<?php echo $prevlabel;?>
									  		</a>
									    </li>
									    <li><a href="#" onclick="<?php echo $nextonclick;?>" style="<?php echo $nextstyle;?>">
									    	<?php echo $nextlabel;?>
									    	</a>
									    </li>
									  </ul>
		</div>
	
	<?php
		 
			}
		 * 
		 */
		}
	}
?>