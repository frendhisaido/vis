<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlconfig.php';
//include 'makegzip.php';
//ob_start();
//ob_implicit_flush(0);
//header( 'Content-Type: application/json' );
//header( 'Content-Disposition: attachment;filename=datelistjson.json' );


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
//print_gzipped_page();
?>