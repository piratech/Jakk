<?php
include '_lib.php';

if (!$_SESSION["uid"]){
	header('HTTP/1.0 403 Forbidden');
	die("Session ist abgelaufen");
}

if (!$_GET["m"]){
	$_GET["m"] = $_POST["modul"];
}

if (file_exists("modul/".$_GET["m"].".php")){
	include_once "modul/".$_GET["m"].".php";
}else{
	header("HTTP/1.0 404 Not Found");?>
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>404 Not Found</title>
</head><body>
<h1>Modul Not Found</h1>
<p>The requested URL was not found on this server.</p>
</body></html>
<?php }