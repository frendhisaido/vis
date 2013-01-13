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

if (!(isset($page))) { 
 $page = 0; 
 } 

if(!(isset($top))){
if(!(isset($rowscount))){
$checkcount = mysql_query("SELECT COUNT(IF
		(MATCH (orientasi,content) AGAINST ('$keywords'), 1, NULL)) as count
		FROM `data` 
		WHERE DATE_FORMAT( DATETIME,  '%Y-%m-%d' ) =  '$tanggal'
		AND orientasi = '$orientasi'");
$rowscount= mysql_result($checkcount, 0);
}

$limitrows = 20;


		?>
		<table class="table table-hover">
		<tbody >
		
		<?php
		
		if($atom == 'perday'){
		$query = "SELECT DATE_FORMAT( datetime,  '%H:%i' ) AS jam,
				content,
				MATCH (orientasi,content) AGAINST ('$keywords') as cocok
				FROM `data` 
				WHERE DATE_FORMAT( datetime,  '%Y-%m-%d' ) =  '$tanggal'
				AND orientasi = '$orientasi'
				ORDER BY cocok DESC
				LIMIT $page,$limitrows"; 
		}else{
		$query = "SELECT DATE_FORMAT( datetime,  '%H:%i' ) AS jam,
				content,
				MATCH (orientasi,content) AGAINST ('$keywords') as cocok
				FROM `data` 
				WHERE DATE_FORMAT( datetime,  '%Y-%m-%d %H' ) =  '$tanggal'
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
			$passkw = str_replace(' ', '%20', $keywords);
				if($isover<$rowscount){
					$nextpage = $page + $limitrows;
					$nexturl = "data/gettweets.php?tg=$tanggal&or=$orientasi&rc=$rowscount&pg=$nextpage&atom=$atom&kw=$passkw";
					$nextonclick =  "\$('#tweetcontainer').html('<img src=\'img/black-020-loading.gif\'/>').load('$nexturl');";
					$nextstyle = "";
					$nextlabel = ">>";
				}else{
					$nextstyle = "background-color: #ddd";
					$nextonclick = "";
					$nextlabel = "||";
				}
				if($isless>=$limitrows || $isless==0){
					$prevpage = $page - $limitrows;
					$prevurl = "data/gettweets.php?tg=$tanggal&or=$orientasi&rc=$rowscount&pg=$prevpage&atom=$atom&kw=$passkw";
					$prevonclick =  "\$('#tweetcontainer').html('<img src=\'img/black-020-loading.gif\'/>').load('$prevurl');";
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
		$query= mysql_query("SELECT count(*) FROM `data`
		WHERE INSTR(content, '$keywords') > 0");
		$rowscount = mysql_result($query, 0);
		if($rowscount>1){
		$limitrows = 20;
	?>
		<table class="table">
		<tbody >	
	<?php
		$query = mysql_query("SELECT DATE_FORMAT(datetime,'%e/%b %H:%i') 
		as tanggal,content,orientasi FROM `data` 
		WHERE INSTR(content, '$keywords') > 0 ORDER BY tanggal ASC
		LIMIT $page,$limitrows");
		
		//$numbers = $page+1;
		while ($row = mysql_fetch_assoc($query)) {
			$content = array();
			$splits = explode(' ', $row["content"],-1); 
			$length = count($splits);
			for ($i = 0; $i <= $length; $i++) {
					
				if(strpos($keywords,$checkkey)===false){
					$content[$i] = "<strong>".$splits[$i]."</strong>";
				}else{
					$content[$i] = $splits[$i];
				}
			}
					
		 ?>
		 <tr id="tweets" title="<?php echo $row["orientasi"]; ?>">
		      <td class="jamtweet"><?php echo $row["tanggal"];?></td>
		      <td class="<?php echo $row["orientasi"]; ?>">
		      	<?php for ($i = 0; $i <= $length; $i++) {
						if($splits[$i]==$keywords){
							echo " <i><b>".$splits[$i]."</b></i> ";
						}else{
							echo " ".$splits[$i]." ";
						}
					};?>
		      	</td>
		 </tr>
		 <?php
		// $numbers++;
		};
		
		?>
		</tbody>
		</table>
		<?php
		
		if($rowscount>$limitrows){
			//echo "rc:".$rowscount;
			$isover = $page + $limitrows;
			$isless = $page - $limitrows;
			//echo " isov:".$isover;
			//echo " isls:".$isless;
			$passkw = str_replace(' ', '%20', $keywords);
				if($isover<$rowscount){
					$nextpage = $page + $limitrows;
					$nexturl = "data/gettweets.php?&top=yes&rc=$rowscount&pg=$nextpage&kw=$passkw";
					$nextonclick =  "\$('#keywordresult').html('<img src=\'img/black-020-loading.gif\'/>').load('$nexturl');";
					$nextstyle = "";
					$nextlabel = ">>";
				}else{
					$nextstyle = "background-color: #ddd";
					$nextonclick = "";
					$nextlabel = "||";
				}
				if($isless>=$limitrows || $isless==0){
					$prevpage = $page - $limitrows;
					$prevurl = "data/gettweets.php?&top=yes&rc=$rowscount&pg=$prevpage&kw=$passkws";
					$prevonclick =  "\$('#keywordresult').html('<img src=\'img/black-020-loading.gif\'/>').load('$prevurl');";
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
		}else{
			?>
			<div class="alert">
			  <strong>Keyword tidak ditemukan.</strong>
			</div>
			<?php
		}
	}
?>