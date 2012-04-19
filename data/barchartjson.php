<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlconfig.php';
$year = $_GET['year'];
// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

// outputs the db as lines of text.
$result = mysql_query("SELECT orientasi, COUNT(date) AS jumlah
					   FROM tweets 
					   WHERE date >= '2011-09-30' AND date <= '2011-10-30'
					   GROUP BY orientasi");
$rows = array();

while($r = mysql_fetch_assoc($result)) {
     $rows[] = $r;
}

echo json_encode($rows);
mysql_close();

?>