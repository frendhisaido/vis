<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlconfig.php';


// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

// outputs the db as lines of text.
$result = mysql_query("SELECT SQL_CACHE DISTINCT DATE(datetime) AS date FROM dataset ORDER BY date");
$rows = array();

while($r = mysql_fetch_assoc($result)) {
     $rows[] = $r;
}

echo json_encode($rows);
mysql_close();

?>