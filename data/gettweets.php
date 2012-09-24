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

@mysql_select_db($dsn) or die( "Unable to select database");


if($keywords!='none'){
		$splits = explode(',', $keywords,-1);
		$count = count($splits);
		$i=0;
		$search="";
		while ($i < $count) {
			$search .= "content LIKE '%" .$splits[$i]."%' ";
			if($i<$count-1){
			$search .= " OR ";
			}
			$i++;
		}
		//AND content LIKE '%pending%' OR content LIKE '%sinyal%'
		
		if($atom == 'perday'){ 
		$query = "SELECT DATE_FORMAT( DATETIME,  '%H:%i' ) AS jam, content
		FROM  `dataset` 
		WHERE DATE_FORMAT( DATETIME,  '%Y-%m-%d' ) =  '$tanggal'
		AND orientasi =  '$orientasi' AND
		$search
		ORDER BY jam
		LIMIT 0,3";
		}else{
		$query = "SELECT DATE_FORMAT( DATETIME,  '%H:%i' ) AS jam, content
		FROM  `dataset` 
		WHERE DATE_FORMAT( DATETIME,  '%Y-%m-%d %H' ) =  '$tanggal'
		AND orientasi =  '$orientasi' AND
		$search
		ORDER BY jam
		LIMIT 0,3";	
		}
		
		
		$result = mysql_query($query);
		while ($row = mysql_fetch_assoc($result)) { 
		 ?>
		 <tr id="tweets" class="toptweet">
		      <td><?php echo $row["jam"]?></td>
		      <td><?php echo $row["content"]?></td>
		 </tr>
		 <?php
		};
		
		if($atom == 'perday'){ 
		$query = "SELECT DATE_FORMAT( DATETIME,  '%H:%i' ) AS jam, content
		FROM  `dataset` 
		WHERE DATE_FORMAT( DATETIME,  '%Y-%m-%d' ) =  '$tanggal'
		AND orientasi =  '$orientasi'
		ORDER BY jam
		LIMIT 0,6";
		}else{
		$query = "SELECT DATE_FORMAT( DATETIME,  '%H:%i' ) AS jam, content
		FROM  `dataset` 
		WHERE DATE_FORMAT( DATETIME,  '%Y-%m-%d %H' ) =  '$tanggal'
		AND orientasi =  '$orientasi'
		ORDER BY jam
		LIMIT 0,6";	
		}
		
		$result = mysql_query($query);
		while ($row = mysql_fetch_assoc($result)) { 
		 ?>
		 <tr id="tweets">
		      <td><?php echo $row["jam"]?></td>
		      <td><?php echo $row["content"]?></td>
		 </tr>
		 <?php
		};
		
		
		
}else{

if($atom == 'perday'){ 
$query = "SELECT DATE_FORMAT( DATETIME,  '%H:%i' ) AS jam, content
FROM  `dataset` 
WHERE DATE_FORMAT( DATETIME,  '%Y-%m-%d' ) =  '$tanggal'
AND orientasi =  '$orientasi'
ORDER BY jam
LIMIT 0,9";
}else{
$query = "SELECT DATE_FORMAT( DATETIME,  '%H:%i' ) AS jam, content
FROM  `dataset` 
WHERE DATE_FORMAT( DATETIME,  '%Y-%m-%d %H' ) =  '$tanggal'
AND orientasi =  '$orientasi'
ORDER BY jam
LIMIT 0,9";	
}

$result = mysql_query($query);

while ($row = mysql_fetch_assoc($result)) { 
 ?>
 <tr id="tweets">
      <td><?php echo $row["jam"]?></td>
      <td><?php echo $row["content"]?></td>
 </tr>
 <?php
};
}
?>