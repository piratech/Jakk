<?
$id = $_POST["id"] + 0;

$data = array("userid" => $_SESSION["uid"], "dbid" => $id, "thechange" => $_POST["change"]);

if ($_POST["note"])
	$data["acomment"] = $_POST["note"];
SQL_insert("changes", $data);

echo "OK";