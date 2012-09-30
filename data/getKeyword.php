<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlconfig.php';
include 'makegzip.php';
ob_start();
ob_implicit_flush(0);

header( 'Content-Type: text/plain' );
$orientasi = $_GET['or'];
$tanggal = $_GET['tg'];
$full = $_GET['full'];

$track = $_GET['track'];
$key = $_GET['key'];

// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

/*
$req = $_GET['req'];

if($req=='bhs'){
	
	
}
*/
if($track=='no'){
$query = "SELECT keywords FROM datakeyword WHERE tanggal='$tanggal' AND orientasi='$orientasi'";

$result = mysql_query($query);
while($r = mysql_fetch_array($result)){
	$keywords = $r["keywords"];
}

if($keywords=='empty:'){
	echo 'kosong';
}else{
		if($full=='y'){
			$cari = array('&lt;','&gt;',':');
			$ganti = array('&#40;','&#41;','&#44;&nbsp;');
			$tampil = str_replace($cari,$ganti,$keywords);
			
			echo substr($tampil, 0, (strlen($tampil)-1));
		}else if($full=='n'){
			
			$splits = explode(':', $keywords,-1);
			$length = count($splits);
			if($length>1){
				for ($i = 0; $i <= 3; $i++) {
		    	echo $splits[$i];
				if($i<3){
					echo ",";
					}
				}	
			}else{
				for ($i = 0; $i <= $length; $i++) {
		    	echo $splits[$i];
				if($i<$length){
					echo ",";
					}
				}	
			}
			
		}
	}
	
	mysql_close();
	print_gzipped_page();
}else if($track=='yes'){
	$query = "SELECT DATE_FORMAT(datetime,'%Y-%m-%d') as tanggal,count(DATE_FORMAT(datetime,'%Y-%m-%d')) as jumlah FROM `dataset`
			 WHERE content LIKE '%$key%' GROUP BY tanggal ORDER BY tanggal ASC";
	$result = mysql_query($query);
	$rows = array();
	while($r = mysql_fetch_assoc($result)) {
	     $rows[] = $r;
	}
	
	echo json_encode($rows);
	mysql_close();
	print_gzipped_page();
}
?>