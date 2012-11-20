<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlconfig.php';
include 'makegzip.php';

ob_start();
ob_implicit_flush(0);

header( 'Content-Type: application/json' );
header( 'Content-Disposition: attachment;filename=barchartjson.json' );
$dfirst = $_GET['df'];
$dlast = $_GET['dl'];

$query = "";

if(empty($dfirst) && empty($dlast)) {
	$query = "SELECT SQL_CACHE orientasi, COUNT(datetime) AS jumlah
						   FROM data 
						   GROUP BY orientasi";
}else if($dfirst==$dlast){
	
	$month = substr($dfirst, 5,2);
	$day   = substr($dfirst, -2);
	
	$query = "SELECT orientasi, COUNT(datetime) AS jumlah
						   FROM data 
						   WHERE MONTH(datetime) = '$month'
						   AND DAY(datetime) = '$day'
						   GROUP BY orientasi";
	//debug
	//echo $dfirst."  ".$dlast." m=".$month." d=".$day."</br>";
	//echo $query."</br>";
	
}else{
	
	$query = "SELECT orientasi, COUNT(datetime) AS jumlah
						   FROM data 
						   WHERE datetime >= '$dfirst' 
						   AND datetime <= '$dlast'
						   GROUP BY orientasi";
	//debug
	//echo $dfirst."  ".$dlast."</br>";
	//echo $query."</br>";
}

// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

$result = mysql_query($query);
$rows = array();
while($r = mysql_fetch_assoc($result)) {
     $rows[] = $r;
}

echo json_encode($rows);
mysql_close();
print_gzipped_page();

?>