<?php
    session_start();
    $debug;
    $status = "Fail";
    //  $_POST['musicId'] = 'LV15';
    //  $_SESSION["userId"] = 11;
    $results = array();
    $debug;
    if (isset($_SESSION["userId"])){
        $link = mysqli_connect('localhost', 'root', '12345blue', 'moondb');
        mysqli_set_charset($link,'utf8');
        $bId = "".$_SESSION["userId"].$_POST["musicId"];
        $sql = "insert into beat(beatId,updateBeatDay,user_iduser,music_musicId,score) values ('"
        .$bId."', NOW(), ".$_SESSION["userId"].", '".$_POST["musicId"]."', ".$_POST["score"]
        .")ON DUPLICATE KEY UPDATE  updateBeatDay = NOW(), score = GREATEST(score, ".$_POST["score"].");" ;
        // $debug = $sql;
        $results = array();
  
  //Get result
        $sqlresult = mysqli_query($link,$sql);
    
        if ($sqlresult){
            $status = "OK";
            while($r = mysqli_fetch_assoc($sqlresult)) {
                $results[] = $r;
            }
        }
        
        $sql = "update challenge set score2=".$_POST["score"]."  where user_iduser2=".$_SESSION["userId"]
        ." and score2 is NULL and music_musicId = '".$_POST["musicId"]."' ;" ;
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
        
        $sql = "select iduser from user where iduser <>".$_SESSION["userId"]." ;" ;
        // $debug = $sql;
        $results = array();
  
  //Get result
        $sqlresult = mysqli_query($link,$sql);
    
        if ($sqlresult){
            $status = "OK";
            while($r = mysqli_fetch_assoc($sqlresult)) {
                $results[] = $r;
            }
        }
        
        $random_keys=array_rand($results,1);
        $id = $results[ $random_keys]["iduser"];
        // $debug =$id;
        
        $sql = "insert into challenge(challengeId, user_iduser1, user_iduser2,"
        ."score1,music_musicId) values ('".rand().time().$_SESSION["userId"]
        ."', ".$_SESSION["userId"].", ". $id.", ".$_POST["score"].", '".$_POST["musicId"]."') ;" ;
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
        
         $sql = "update user set coin = coin+4 where iduser = ".$_SESSION["userId"].";";
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
            
        $sql = "update music set count = count+1 where musicId = ".$_SESSION["musicId"].";";
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
    else
    {
         $status = "NoLogin";
    }
    
    
    // $status = intval($results[0]["coin"])>= 30;
    $apiRes = array(
        'status'=> $status,
        'results'=> $results
        // ,
        // 'debug' =>$debug
    );
    print json_encode($apiRes);
?>