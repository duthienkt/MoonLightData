<?php
    session_start();
    $debug;
    $status = "Fail";
    //  $_POST['musicId'] = 'LV15';
    //  $_SESSION["userId"] = 11;
    $id = $_POST['musicId'];
    $results = array();
    if (isset($_SESSION["userId"])){
        $idUser = $_SESSION["userId"];
        $link = mysqli_connect('localhost', 'root', '12345blue', 'moondb');
        mysqli_set_charset($link,'utf8');
        $sql = "select * from user where iduser =".$idUser.";";
        $results = array();
  
  //Get result
        $sqlresult = mysqli_query($link,$sql);
    
        if ($sqlresult){
            $status = "OK";
            while($r = mysqli_fetch_assoc($sqlresult)) {
                $results[] = $r;
            }
        }
        if (intval($results[0]["coin"])>= 30){
            $sql = "select * from buy where user_iduser =".$idUser." and music_musicId='".$id."';";
            $results = array();
  //Get result
            $sqlresult = mysqli_query($link,$sql);
    
            if ($sqlresult){
                $status = "OK";
                while($r = mysqli_fetch_assoc($sqlresult)) {
                    $results[] = $r;
                }
            } 
          
            if (count($results) == 0){
                $sql = "insert into buy(day,user_iduser,music_musicId) values (NOW(), ".$_SESSION["userId"].", '".$id."');";
                $debug = $sql;
                $results = array();
  //Get result
            $sqlresult = mysqli_query($link,$sql);
    
            if ($sqlresult){
                $status = "OK";
                while($r = mysqli_fetch_assoc($sqlresult)) {
                    $results[] = $r;
                }
            } 
            
             $sql = "update user set coin = coin-30 where iduser = ".$_SESSION["userId"].";";
             $debug = $sql;
             $results = array();
  //Get result
            $sqlresult = mysqli_query($link,$sql);
    
            if ($sqlresult){
                $status = "OK";
                while($r = mysqli_fetch_assoc($sqlresult)) {
                    $results[] = $r;
                }
            } 
           
        }
        
    }
        else
        {
            $status = "ERROR";
        }
    }
    else
    {
         $status = "NoLogin";
    }
    // $status = intval($results[0]["coin"])>= 30;
    $apiRes = array(
        'status'=> $status,
        'results'=> $results,
        'debug' =>$debug
    );
    print json_encode($apiRes);
?>