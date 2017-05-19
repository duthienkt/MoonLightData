<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Payment success</title>
<link href="../bootstraps/bootstrap.css" rel="stylesheet">
	<link rel="stylesheet" href="../bootstraps/include.css" type="text/css" />
	<script src="../jquery/jquery-3.1.1.min.js"></script>
	
	<script src="../p5js/p5.js" type="text/javascript"></script>
    <script src="../p5js/p5.dom.js" type="text/javascript"></script>
    <script src="../p5js/p5.sound.js" type="text/javascript"></script>
    <script src="../menu_top.js" type="text/javascript"></script>
    <style type="text/css">
    	body{
			background: url(../image/bg_coin_2.jpg) no-repeat center fixed;
			background-size: cover;
		}
		#head{
			margin: 10px;
		}
		h1{
			color: #000fff;
			font-size: 2em;
			border-bottom:1px solid #000fff;
		}
		h3{
			height: 50px;
			font-size: 1.5em;
		}
		#footer{
			border-top: 4px solid rgba(0, 128, 128, 0.3);
			background-color: rgba(64, 128, 128, 0.4);
		}
		p{
			margin: 10px;
			padding: 2px;
		}
		
		.user{
			margin-top: 80px;
		}
		.icon{
			margin-top: 10px;
		}
    </style>
</head>

<?php
session_start();
	include "../connect/connect.php";
include 'config.php';
include 'lib/nganluong.class.php';
if (isset($_GET['payment_id']) || true) {
	// Lấy các tham số để chuyển sang Ngânlượng thanh toán:

	$transaction_info =$_GET['transaction_info'];
	$order_code =$_GET['order_code'];
	$price =$_GET['price'];
	$payment_id =$_GET['payment_id'];
	$payment_type =$_GET['payment_type'];
	$error_text =$_GET['error_text'];
	$secure_code =$_GET['secure_code'];
    //Khai báo đối tượng của lớp NL_Checkout
	$nl= new NL_Checkout();
	$nl->merchant_site_code = MERCHANT_ID;
	$nl->secure_pass = MERCHANT_PASS;
	//Tạo link thanh toán đến nganluong.vn
	$checkpay= $nl->verifyPaymentUrl($transaction_info, $order_code, $price, $payment_id, $payment_type, $error_text, $secure_code);
	
    if ($checkpay) {
    	date_default_timezone_set('Asia/Ho_Chi_Minh');
    	$currentDate = date("Y-m-d h:i:sa");
    	$idUser = $_SESSION["userId"];
    	$sql = "INSERT INTO user(htId, hisName, hisValue, hisDate, user_iduser)
    	VALUES('$payment_id', '$transaction_info', '$price', '$currentDate', '$idUser'";
    	if(mysqli_query($conn, $sql)){
    		echo "<script>document.getElementById('success').innerHTML = Data saved.</script>";
    	}
    	else{
    		echo "<script>document.getElementById('success').innerHTML = Data don't save.</script>";
    	}
		// echo 'Payment success: <pre>'; 
		// // bạn viết code vào đây để cung cấp sản phẩm cho người mua		
		// print_r($_GET);
	}else{
		echo "<script>document.getElementById('success').innerHTML = Payment failed.</script>";
	}
}
?>

<body>
<div id='sketch-holder' style="float:left"></div>
<div class="row">
	<div id="username">
		<?php
			if(!empty($_SESSION["userId"])){
				$id = intval($_SESSION["userId"]);
				$query_user = mysqli_query($conn, "select * from user where `iduser` = '$id'");
				$row_user = mysqli_fetch_array($query_user);
				if($row_user){
					echo "<img id='user' src='../image/img_user.jpeg' width='30px' height='30px'><a id='username' href='../infomation.html'>Hello " . $row_user["userName"] . "</a>";
				}
			}
		?>
	</div>
	<div class="col-lg-offset-2 col-md-offset-2 col-sm-offset-2 col-xs-offset-2 col-lg-7 col-md-7 col-sm-7 col-xs-7">
		<img src="../image/logo.png" width="500px" height="250px">
	</div>
</div>

<div class="row" style="height: 100px">
	<p id="success" style="text-align:center"></p>
</div>
	
<div class="feedback" id="feedback-box"><h4>Feedback</h4>		
	<a class="close" href="#">
		<img class="img-close" title="Close Window" alt="Close" src="../image/close.png" width="25px" height="25px" />
	</a>
	<form class="feedback-content" method="POST" action="<?php echo $_SERVER['PHP_SELF'];?>">
		<label class="username">
			<label for="username">Feedback of <?php echo $row_user['userName'];?></label>
		</label>
		<label class="contentname">
			<label for="contentid">Topic</label>
			<input id="contentid" type="text" autocomplete="on" name="topic" placeholder="" value="" />
		</label>
		<label class="content-form">
			<label for="contentdet">Content</label>
			<textarea id="contentdet" name="content"></textarea>
		</label>
		<input style="width: 100px" class="button submit-button" type="submit" name="submit1" value="Send"/>
	</form>
</div>
<?php
	if(isset($_POST["submit1"])){
		$topic = mysqli_real_escape_string($conn, $_POST["topic"]);
		$content = mysqli_real_escape_string($conn, $_POST["content"]);
			
		if(empty($topic)){
			$topic = "No topic";
		}
		if(empty($content)){
			echo "<script>alert('Feedback isn\'t sent.');</script>";
		}
		else{
			date_default_timezone_set('Asia/Ho_Chi_Minh');
	       	$fbDate = date("Y-m-d h:i:sa");
	       	$idFb = $id . "fb" . date(dmy);
	       	$sql = "INSERT INTO feedback(idfeedback, fbTitle, fbContent, fbDate, user_iduser) 
	       						VALUES('$idFb', '$topic', '$content', '$fbDate', '$id')";
			if(mysqli_query($conn, $sql)){
				echo "<script> alert('Sent feedback.');
			 	$('#over, .feedback').fadeOut(300 , function() {
			 		$('#over').remove();
			 	});</script>";
			}
			else{
				echo "<script>alert('Feedback isn\'t sent.');</script>"; 
			}
		}
	}
	if($row_user){
?>
	<a class="feedback-window btn-top" href="#feedback-box" alt="Feedback"><img src="../image/feedback.png" title="Feedback" width="40px" height="40px"></a>
<?php 
}
?>
<script type="text/javascript">
	$(document).ready(function() {
		$('a.feedback-window').click(function() {
	        //lấy giá trị thuộc tính href - chính là phần tử "#feedback-box"
	        var feedbackBox = $(this).attr('href');
		    //cho hiện hộp đăng nhập trong 300ms
		    $(feedbackBox).fadeIn(300);
	    	// thêm phần tử id="over" vào sau body
	    	$('body').append('<div id="over">');
	    	$('#over').fadeIn(300);
	    	return false;
	    });

		// khi click đóng hộp thoại
		$(document).on('click', "a.close, #over", function() {
			if(confirm("Do you want to close feedback box?") == true){
			$('#over, .feedback').fadeOut(300 , function() {
				$('#over').remove();
			});
			return false;
		}
		});
	});
</script>

<div class="row" id="footer">
	<div class="col-lg-2 col-md-3 col-sm-3 col-xs-3">
		<img src="../image/logo.png" width="220px" height="100px">
	</div>
	<div class="col-lg-10 col-md-9 col-sm-9 col-xs-9">
	<p>Email: <a href="#">huathitoquyen0403@gmail.com</a></p>
		<p>Address: 268, Lý Thường Kiệt, Phường 14, quận 10, TP.HCM</p>
		<p>Phone number: 0986.980.391</p>
		<p>Contact us:
			<a href="https://www.facebook.com/" alt="facebook"><img src="../image/face_icon.png" width="25px" height="25px"></a>
			<a href="https://twitter.com/" alt="switter"><img src="../image/twitter_icon.png" width="25px" height="25px"></a>
		</p>
	</div>
</div>
</body>
</html>


