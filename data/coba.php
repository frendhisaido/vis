<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlconfig.php';


// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

// outputs the db as lines of text.
$result = mysql_query("SELECT perdate, positif,negatif,netral FROM perday GROUP BY perdate");
$rows = array();

while($r = mysql_fetch_assoc($result)) {
     $rows[] = $r;
}

print_r($rows);
foreach ($rows as $i => $value){
	echo $rows[$i];
}
mysql_close();

?>