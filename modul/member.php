<?
$id = $_POST["id"] + 0;

$data = array();

$data["member"] = SQL_select_one("members", "dbid = $id");
$data["change"] = SQL_select_as_array("changes, users", "dbid = $id and changes.userid = users.userid", "changes.*, users.name");

echo json_encode($data);
