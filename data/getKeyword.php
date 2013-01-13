<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlconfig.php';
include 'makegzip.php';
ob_start();
ob_implicit_flush(0);

header( 'Content-Type: text/plain' );
$orientasi = $_GET['or'];
$tanggal = $_GET['tg'];
$full = $_GET['full'];

$track = $_GET['track'];
$key = $_GET['key'];

// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

/*
$req = $_GET['req'];

if($req=='bhs'){
	
	
}
*/

if($track=='count'){

    $query = "SELECT  'n' AS xx, COALESCE(COUNT(content),0) as jum FROM data WHERE content LIKE '%$key%' AND orientasi='negatif'
                UNION
                SELECT 'p' AS xx, COALESCE(COUNT(content),0) as jum FROM data WHERE content LIKE '%$key%' AND orientasi='positif'
                UNION
                SELECT 'o' AS xx, COALESCE(COUNT(content),0) as jum FROM data WHERE content LIKE '%$key%' AND orientasi='nonopini'";
   $result = mysql_query($query);
   $rows = array();
    while($r = mysql_fetch_array($result)){
       $rows[] = $r['jum']+0;
    }
    echo json_encode($rows);
    
} else if($track=='no'){
    $query = "SELECT keywords FROM setofkeywords WHERE tanggal='$tanggal' AND orientasi='$orientasi'";
    
    $result = mysql_query($query);
    while($r = mysql_fetch_array($result)){
    	$keywords = $r["keywords"];
    }
    
    if($keywords=='empty:'){
    	echo 'kosong';
    }else{
        echo $keywords;
    }
	mysql_close();
	print_gzipped_page();
}else if ($track=='big') {
    $query = "SELECT keywords FROM setofkeywords WHERE orientasi='$orientasi'";
    
    $result = mysql_query($query);
    while($r = mysql_fetch_array($result)){
    	$keywords = $r["keywords"];
    }
    
    if($keywords=='empty:'){
    	echo 'kosong';
    }else{
        $rows = array();
        $tempjson = array();
        $json = array();
        $rows = explode(' ', $keywords);
        foreach($rows as $r) {
            $tempar = explode(':', $r);
            $tempjson['key'] = $tempar[0];
            $tempjson['val'] = $tempar[1];
            $json[] = $tempjson;
        }
        unset($r);
        //var_dump($json);
        echo json_encode($json);
    }
	mysql_close();
	print_gzipped_page();

}else if($track=='yes'){
    if(isset($orientasi)){
        $query = "SELECT DATE_FORMAT(datetime,'%Y-%m-%d') as tanggal,count(DATE_FORMAT(datetime,'%Y-%m-%d')) as jumlah FROM `data`
                 WHERE content LIKE '%$key%' AND orientasi='$orientasi' GROUP BY tanggal ORDER BY tanggal ASC";    
    }else{
	   $query = "SELECT DATE_FORMAT(datetime,'%Y-%m-%d') as tanggal,count(DATE_FORMAT(datetime,'%Y-%m-%d')) as jumlah FROM `data`
			     WHERE content LIKE '%$key%' GROUP BY tanggal ORDER BY tanggal ASC";
    }         
	$result = mysql_query($query);
	$rows = array();
	while($r = mysql_fetch_assoc($result)) {
	     $rows[] = $r;
	}
	
	echo json_encode($rows);
	
}

mysql_close();
print_gzipped_page();
?>