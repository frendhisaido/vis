<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlconfig.php';
$dfirst = $_GET['df'];
$dlast = $_GET['dl'];

if(empty($dfirst) && empty($dlast)) {
	$dfirst = '2011-09-30';
	$dlast = '2011-10-30';
}

// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");


$result = mysql_query("SELECT orientasi, COUNT(date) AS jumlah
					   FROM tweets 
					   WHERE date >= '".$dfirst."' AND date <= '".$dlast."'
					   GROUP BY orientasi");
$rows = array();
while($r = mysql_fetch_assoc($result)) {
     $rows[] = $r;
    /* foreach($r as $key => $value)
    {    $arr[$key] = $value; }

    $rows[] = $arr;*/
}
// outputs the db as json
echo json_encode($rows);
mysql_close();

?>