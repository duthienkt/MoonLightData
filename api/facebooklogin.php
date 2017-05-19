<?php
    session_start();
    $status = "Fail";
    if($_POST["gender"] == "Male")
    $_POST["gender"] = "male";
    if($_POST["gender"] == "Female")
    $_POST["gender"] = "female";
    
    // $deviceId =  'qwertyuiop';
    $link = mysqli_connect('localhost', 'root', '12345blue', 'moondb');
    mysqli_set_charset($link,'utf8');
    $sql = "SELECT * FROM `user` where email='".$_POST["email"]."';";
    $results = array();
    $sqlresult = mysqli_query($link,$sql);
    
    if ($sqlresult){
        $status = "OK";
        while($r = mysqli_fetch_assoc($sqlresult)) {
            $results[] = $r;
        }
    }  
    if (count($results)<1){
        $sql = "INSERT INTO `user` (`userName`, `fullName`, `email`, `password`, `sex`, `birthday`, `createDay`, `updateDay`, `coin`, `phone`) "
            ."VALUES( '"
            .$_POST["id"]."', '"
            .$_POST["name"]."', '"
            .$_POST["email"]."', 'NoPassword', '".$_POST["gender"]."', NOW(), NOW(),NOW(), 100, 'NoPhone')";
  
  //Get result
        $sqlresult = mysqli_query($link,$sql);
    
        if ($sqlresult){
            $status = "OK";
            while($r = mysqli_fetch_assoc($sqlresult)) {
                $results[] = $r;
            }
        }  
    }
    
     $sql = "SELECT * FROM `user` where email='".$_POST["email"]."';";
     $results = array();
    $sqlresult = mysqli_query($link,$sql);
    
    if ($sqlresult){
        $status = "OK";
        while($r = mysqli_fetch_assoc($sqlresult)) {
            $results[] = $r;
        }
    }  
    
    
    $_SESSION["userId"] =  $results[0]["iduser"];
    
    $apiRes = array(
        'status'=> $status,
        'results'=> $results
        // 'sql'=>$sql
    );
    print json_encode($apiRes);
    // print json_encode($_POST);
?>