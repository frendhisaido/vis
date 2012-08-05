<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlconfig.php';
$dfirst = $_GET['df'];
$dlast = $_GET['dl'];

$query = "";

if(empty($dfirst) && empty($dlast)) {
	$query = "SELECT orientasi, COUNT(datetime) AS jumlah
						   FROM dataset 
						   GROUP BY orientasi";
}else{
	$query = "SELECT orientasi, COUNT(datetime) AS jumlah
						   FROM dataset 
						   WHERE datetime >= '".$dfirst."' AND datetime <= '".$dlast."'
						   GROUP BY orientasi";
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

?>