<?

switch ($_GET["type" ]) {
	case 'akked' :
		$data = SQL_query_as_array("select members.*, state from members join (SELECT dbid, thechange as state FROM changes GROUP BY dbid ORDER BY `thetime` DESC) as ch on (ch.dbid = members.dbid)");
		break;
	case 'changes' :
		$data = SQL_query_as_array("select * from changes join members on (members.dbid = changes.dbid)");
		break;
	case 'schatz' :
		$data = SQL_query_as_array("select * from changes join members on (members.dbid = changes.dbid) where thechange = 2 or thechange = 3 order by `division`");
		break;
}

header("Content-Type: text/csv; charset=utf-8");
header("Content-Disposition: attachment; filename={$_GET["type" ]}.csv");
header("Content-Description: csv File");
header("Pragma: no-cache");
header("Expires: 0");

$d = $data[0];
foreach ($d as $key => $value) {
	echo '"' . $key . '",';
}
echo "\n";

foreach ($data as $key => $value) {
	foreach ($value as $k => $v) {
		echo '"' . $v . '",';
	}
	echo "\n";
}
