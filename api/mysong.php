<?php
    session_start();
    $status = "Fail";
    $results = array();
    if (isset($_SESSION["userId"])){
    $idUser = $_SESSION["userId"];
  
    
    // $deviceId =  'qwertyuiop';
    $link = mysqli_connect('localhost', 'root', '12345blue', 'moondb');
    mysqli_set_charset($link,'utf8');
    $sql = "select id, music_musicId from buy where user_iduser =".$idUser.";";
  
  //Get result
    $sqlresult = mysqli_query($link,$sql);
    
    if ($sqlresult){
        $status = "OK";
        while($r = mysqli_fetch_assoc($sqlresult)) {
            $results[] = $r;
        }
    }  }
    else
    {
         $status = "NoLogin";
    }
    
    $apiRes = array(
        'status'=> $status,
        'results'=> $results
    );
    print json_encode($apiRes);
?>