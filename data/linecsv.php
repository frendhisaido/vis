<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlconfig.php';
//include 'makegzip.php';
//ob_start();
//ob_implicit_flush(0);


$atom = $_GET['atom'];
$formatdate;
if($atom=='perday'){
	$formatdate='%Y-%m-%d';
}else if($atom=='perhour'){
	$formatdate='%Y-%m-%d %H';
}

// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

// outputs the db as lines of text.
$result = mysql_query("SELECT SQL_CACHE orientasi,DATE_FORMAT(datetime,'$formatdate') as date,count(DATE_FORMAT(datetime,'$formatdate')) as jumlah FROM dataset WHERE orientasi='negatif' group by DATE_FORMAT(datetime,'$formatdate')
UNION
SELECT SQL_CACHE orientasi,DATE_FORMAT(datetime,'$formatdate') as date,count(DATE_FORMAT(datetime,'$formatdate')) as jumlah FROM dataset WHERE orientasi='positif' group by DATE_FORMAT(datetime,'$formatdate')
UNION
SELECT SQL_CACHE orientasi,DATE_FORMAT(datetime,'$formatdate') as date,count(DATE_FORMAT(datetime,'$formatdate')) as jumlah FROM dataset WHERE orientasi='nonopini' group by DATE_FORMAT(datetime,'$formatdate')");
header( 'Content-Type: text/csv' );
header( 'Content-Disposition: attachment;filename=line.csv' );
  //
  // output header row (if atleast one row exists)
  //
  $row = mysql_fetch_assoc( $result );
  if ( $row )
  {
    echocsv( array_keys( $row ) );
  }
  //
  // output data rows (if atleast one row exists)
  //
  while ( $row )
  {
    echocsv( $row );
    $row = mysql_fetch_assoc( $result );
  }
  //
  // echocsv function
  //
  // echo the input array as csv data maintaining consistency with most CSV implementations
  // * uses double-quotes as enclosure when necessary
  // * uses double double-quotes to escape double-quotes 
  // * uses CRLF as a line separator
  //
  function echocsv( $fields )
  {
    $separator = '';
    foreach ( $fields as $field )
    {
      if ( preg_match( '/\\r|\\n|,|"/', $field ) )
      {
        $field = '"' . str_replace( '"', '""', $field ) . '"';
      }
      echo $separator . $field;
      $separator = ',';
    }
    echo "\r\n";
  }

//print_gzipped_page();
?>  
