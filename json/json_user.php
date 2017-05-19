<?php
include "../connect/connect.php";
    $id = intval($_GET["userId"]);
	$query = mysqli_query($conn, "select * from `user` where `iduser` = '$id'");
    $status = false;
    $results = array();
    if($query){
        while($row = mysqli_fetch_assoc($query)){
            $results[] = $row;
        }
        $apiRes = array(
            'status' => $status,
            'result' => $results
        );
        print json_encode($apiRes);
    }
    else{
        echo "query fail";
    }
?>