<?

$q = $_POST;

if ($q["membershipid"]) {
	$w = "membershipid = " . ($q["membershipid"] + 0);
} else {
	$w = array();
	$vals = array("firstname", "lastname", "division", "adress", "zipcode", "city", "birthdate");
	foreach ($vals as $key) {
		if ($q["$key"] != "")
			$w[] = "($key like '%" . mysql_real_escape_string($q["$key"]) . "%')";
	}
	$w = implode(" and ", $w);
}
$d = SQL_select_as_array("members", $w);

if ($d == null) {
	die("null");
}

$data["members"] = $d;

$t = array();
foreach ($d as $v) {
	$t["division"][$v["division"]] = TRUE;
	$t["firstname"][$v["firstname"]] = TRUE;
	$t["lastname"][$v["lastname"]] = TRUE;
	$t["city"][$v["city"]] = TRUE;
	$t["adress"][$v["adress"]] = TRUE;
}
foreach ($t as $key => $value) {
	foreach ($value as $k => $v) {
		$data["autocomplete"][$key][] = $k;
	}
}

echo json_encode($data);
