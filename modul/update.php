<?
$id = $_POST["id"] + 0;

if (($_POST["change"] == 2 or $_POST["change"] == 3) and (!$_SESSION["treasurer"])){
	header('HTTP/1.0 403 Forbidden');
	die("Dafür hast du keine Berechtigung");
}

$data = array("userid" => $_SESSION["uid"], "dbid" => $id, "thechange" => $_POST["change"]);

if ($_POST["note"])
	$data["acomment"] = $_POST["note"];
SQL_insert("changes", $data);

echo "OK";