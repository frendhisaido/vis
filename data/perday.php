<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlconfig.php';

// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

// outputs the db as lines of text.
$result = mysql_query("SELECT * FROM perday");
$rows = array();
while($r = mysql_fetch_assoc($result)) {
     $rows[] = $r;
    /* foreach($r as $key => $value)
    {    $arr[$key] = $value; }
	    $rows[] = $arr;*/
}

echo json_encode($rows);
mysql_close();

?>