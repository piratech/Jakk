<?

$d = SQL_query_as_array("select count(*) as count FROM (SELECT  thechange FROM changes GROUP BY dbid ORDER BY `thetime` DESC) as t where thechange = 0;");
$data["akked"] = $d[0]["count"] + 0;

echo json_encode($data);
