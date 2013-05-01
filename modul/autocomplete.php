<?

$data = array();

$vals = array("division", "firstname", "lastname", "city");
foreach ($vals as $value) {
	$data[$value] = array();
	$a = SQL_query_as_array("select $value from members group by $value;");
	foreach ($a as $v) {
		$data[$value][] = $v[$value];
	}
}

echo json_encode($data);
