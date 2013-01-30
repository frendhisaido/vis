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
		<div id='datatable'>
		<div id="tweettable">
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
		      <td class="<?php echo 'left_tab tab_'.$orientasi ?>"><div class="numtab"><?php echo $numbers; ?>.</div></td>
		      <td class="jamtweet"><?php echo $row["jam"]; ?></td>
		      <td class="tweetcontent"><?php echo $row["content"]; ?></td>
		 </tr>
		 <?php
		 $numbers++;
		};
		?>
		</tbody>
		</table>
		</div>
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
					$nextonclick =  "loadTweetResult('$nexturl','#paginationtweet', '#tweetcontainer','#tweet .tweetcontent','#keywordsCache');";
					$nextstyle = "";
					$nextlabel = "<i class='icon-chevron-right'></i>";
				}else{
					$nextstyle = "background-color: #ddd";
					$nextonclick = "";
					$nextlabel = "<i class='icon-stop'></i>";
				}
				if($isless>=$limitrows || $isless==0){
					$prevpage = $page - $limitrows;
					$prevurl = "data/gettweets.php?tg=$tanggal&or=$orientasi&rc=$rowscount&pg=$prevpage&atom=$atom&kw=$passkw";
					$prevonclick =  "loadTweetResult('$prevurl','#paginationtweet', '#tweetcontainer','#tweet .tweetcontent','#keywordsCache');";
					$prevstyle = "";
					$prevlabel = "<i class='icon-chevron-left'></i>";
				}else{
					$prevstyle = "background-color: #ddd";
					$prevonclick = "";
					$prevlabel = "<i class='icon-stop'></i>";
				}
		?>
		<div id="pagingbutton">
									  <ul class="pagination pagination-centered">
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
	   <div id="datatable">
	    <div id="tweettable">
		<table id="searchresult" class="table">
		<tbody >	
	<?php
		$query = mysql_query("SELECT DATE_FORMAT(datetime,'%e/%b %H:%i') 
		as tanggal,content,orientasi FROM `data` 
		WHERE INSTR(content, '$keywords') > 0 ORDER BY tanggal ASC
		LIMIT $page,$limitrows");
		
		$numbers = $page+1;
		while ($row = mysql_fetch_assoc($query)) {
	
		 ?>
		 <tr id="tweets" title="<?php echo $row["orientasi"]; ?>">
		      <td class="<?php echo 'left_tab tab_'.$row["orientasi"]; ?>"><div class="numtab"><?php echo $numbers; ?>.</div></td>
		      <td class="jamtweet"><?php echo $row["tanggal"];?></td>
		      <td class="tweetcontent"><?php echo $row["content"];?></td>
		 </tr>
		 <?php
		 $numbers++;
		};
		
		?>
		</tbody>
		</table>
		</div>
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
					$nextonclick =  "loadTweetResult('$nexturl','#paginationsearch','#keywordresult','#telusur .tweetcontent','#displaySearchKeyword');";
					$nextstyle = "";
					$nextlabel = "<i class='icon-chevron-right'></i>";
				}else{
					$nextstyle = "background-color: #ddd";
					$nextonclick = "";
					$nextlabel = "<i class='icon-stop'></i>";
				}
				if($isless>=$limitrows || $isless==0){
					$prevpage = $page - $limitrows;
					$prevurl = "data/gettweets.php?&top=yes&rc=$rowscount&pg=$prevpage&kw=$passkws";
					$prevonclick =  "loadTweetResult('$prevurl','#paginationsearch','#keywordresult','#telusur .tweetcontent','#displaySearchKeyword');";
					$prevstyle = "";
					$prevlabel = "<i class='icon-chevron-left'></i>";
				}else{
					$prevstyle = "background-color: #ddd";
					$prevonclick = "";
					$prevlabel = "<i class='icon-stop'></i>";
				}
		?>
		<div id="pagingbutton">
									  <ul class="pagination pagination-centered">
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