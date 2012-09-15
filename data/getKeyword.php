<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlconfig.php';
//include 'makegzip.php';
//ob_start();
//ob_implicit_flush(0);

header( 'Content-Type: text/plain' );
$orientasi = $_GET['or'];
$tanggal = $_GET['tg'];
$full = $_GET['full'];
/*
$req = $_GET['req'];

if($req=='bhs'){
	
	
}
*/

$query = "SELECT keywords FROM datakeyword WHERE tanggal='$tanggal' AND orientasi='$orientasi'";

// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

$result = mysql_query($query);
while($r = mysql_fetch_array($result)){
	$keywords = $r["keywords"];
}
if($full=='y'){
	$cari = array('&lt;','&gt;',':');
	$ganti = array('&#40;','&#41;','&#44;&nbsp;');
	$tampil = str_replace($cari,$ganti,$keywords);
	
	echo substr($tampil, 0, (strlen($tampil)-1));
}else if($full=='n'){
	$splits = explode(':', $keywords,-1);
	for ($i = 1; $i <= 3; $i++) {
    	echo $splits[$i];
		if($i<3){
			echo ", ";
		}
	}	
}

mysql_close();
//print_gzipped_page();
?>