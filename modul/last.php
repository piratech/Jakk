<?

$data = SQL_query_as_array("select members.* from members, changes where members.dbid = changes.dbid and userid = {$_SESSION["uid"]} order by thetime DESC limit 100");

echo json_encode($data);
