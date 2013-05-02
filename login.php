<?
include '_lib.php';

if ($_POST["logout"]){
	$_SESSION = array();
	die("OK");
}

if ($_POST["login"]){
	$d = SQL_select_one("users","name = '".mysql_real_escape_string($_POST["login"])."'");
	if (md5($_POST["password"]) == $d["hash"]){
		$_SESSION["name"] = $d["name"];
		$_SESSION["uid"] = $d["userid"];
		$_SESSION["treasurer"] = ($d["treasurer"] == 1);
	}
}



if (!$_SESSION["uid"]){
	header("HTTP/1.0 404 Not Found");
	echo "please login";
}else{
	echo $_SESSION["name"]; 
}