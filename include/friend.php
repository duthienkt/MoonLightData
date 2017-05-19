<?php
include "../connect/connect.php";
include "header.html";
if(isset($_POST['addfriend'])){
    $id = $_POST['id'];
    $query = mysqli_query($conn, "select * from user where iduser = '$id'");
    if($row = mysqli_fetch_array($query)){
        $user1 = $row['userName'];
        $user2 = $row_user['userName'];
        $id_friend = "fr" + $id + "" + $row_user['iduser'];
        $query_friend = mysqli_query($conn, "insert into friend(id, userName1, userName2, status) values('$id_friend', '$user1', '$user2', 0)");
        if($query_friend){
            echo "success";
        }
        else echo "fail";
    }
}
?>