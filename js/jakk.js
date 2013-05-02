var Ereignisse = {
	0 : "Akkred.",
	1 : "De-Akk.",
	2 : "Bezahlt",
	3 : "unPay"
}

var autocompleteBase = {};

var TimeOut = 600;
var TickerCount = 0;

function buildAutocomplete(data) {
	$("#division").autocomplete({
		source : data["division"]
	});
	$("#firstname").autocomplete({
		source : data["firstname"]
	});
	$("#lastname").autocomplete({
		source : data["lastname"]
	});
	$("#city").autocomplete({
		source : data["city"]
	});
	$("#adress").autocomplete({
		source : data["adress"]
	});
}

function updateMember(dbid, state) {
	var data = {};

	data["modul"] = "update";
	data["id"] = dbid;
	data["change"] = state;

	if ($("#note").val() != "") {
		data["note"] = $("#note").val();
	}

	$.ajax({
		url : 'api.php',
		cache : false,
		type : 'POST',
		data : data,
		success : function(data) {
			showMember(dbid);
		}
	}).fail(function(data) {
		alert(data.responseText);
	});
}

function showMember(dbid) {
	$.ajax({
		url : 'api.php',
		cache : false,
		type : 'POST',
		data : {
			"modul" : "member",
			"id" : dbid
		},
		success : function(data) {
			data = JSON.parse(data);
			buildTable({
				0 : data["member"]
			});
			$('#member').show();

			$('#membershipid_show').text(data["member"]["membershipid"]);
			if (data["member"]["warning"] == "") {
				$('#_warning').hide();
			} else {
				$('#warning').text(data["member"]["warning"]);
				$('#_warning').show();
			}
			if (data["member"]["acomment"] == "") {
				$('#_comment').hide();
			} else {
				$('#comment').text(data["member"]["acomment"]);
				$('#_comment').show();
			}

			if ((data["member"]["topay"] == null) || (data["member"]["topay"] == 0)) {
				var state = 1;
			} else {
				var state = 3;
			}

			$('#change_tabel').empty();
			if (data["change"] == null) {
				var tr = $('<tr />').appendTo('#change_tabel');

				$('<td/>', {
					html : "Keine Ereignisse"
				}).appendTo(tr);
			} else {
				$.each(data["change"], function(key, val) {
					state = parseInt(val["thechange"]);

					var tr = $('<tr />').appendTo('#change_tabel');

					$('<td/>', {
						html : val["name"]
					}).appendTo(tr);

					$('<td/>', {
						html : val["thetime"]
					}).appendTo(tr);

					$('<td/>', {
						html : Ereignisse[val["thechange"]]
					}).appendTo(tr);

					$('<td/>', {
						html : val["acomment"]
					}).appendTo(tr);

				});
			}

			$('#note').val("");

			if ((state == 1) && (data["member"]["topay"] != null) && (data["member"]["topay"] != 0)) {
				state = 2;
			}

			$('#unpay').hide();
			switch(state) {
				case 2:
					$('#unpay').show().attr("onClick", "updateMember(" + dbid + ",3);");
				case 1:
					$('#akk_btn').text("Akkredetiere Person").attr("onClick", "updateMember(" + dbid + ",0);");
					break;
				case 3:
					$('#akk_btn').text(data["member"]["topay"] + "€ entgegennehmen").attr("onClick", "updateMember(" + dbid + ",2);");
					break;
				case 0:
					$('#akk_btn').text("De-Akkredetiere Person").attr("onClick", "updateMember(" + dbid + ",1);");
					break;
			}
			window.scrollTo(0, 0);
		}
	}).fail(function(data) {
		alert(data.responseText);
	});
}

function buildTable(data) {
	$('#liste').empty();

	$.each(data, function(key, val) {

		var tr = $('<tr />').click(function() {
			showMember(val["dbid"]);
		}).appendTo('#liste');

		$('<td/>', {
			html : val["firstname"]
		}).appendTo(tr);
		$('<td/>', {
			html : val["lastname"]
		}).appendTo(tr);

		$('<td/>', {
			html : val["division"]
		}).appendTo(tr);

		$('<td/>', {
			html : val["birthdate"]
		}).appendTo(tr);

		$('<td/>', {
			html : val["adress"]
		}).appendTo(tr);
		$('<td/>', {
			html : val["zipcode"]
		}).appendTo(tr);
		$('<td/>', {
			html : val["city"]
		}).appendTo(tr);

	});
	$('#liste').show();
	$('#wait').hide();
}

function such() {
	$('#liste').hide();
	$('#wait').show();
	$('#member').hide();

	var data = {};

	if ($("#membershipid").val() != "") {
		data["membershipid"] = $("#membershipid").val();
		var wenig = false;
	} else {
		data["name"] = $("#name").val();
		data["firstname"] = $("#firstname").val();
		data["lastname"] = $("#lastname").val();
		data["division"] = $("#division").val();
		data["birthdate"] = $("#birthdate").val();
		data["adress"] = $("#adress").val();
		data["zipcode"] = $("#zipcode").val();
		data["city"] = $("#city").val();

		var wenig = true;
		$.each(data, function(k, v) {
			if (v.length >= 3) {
				wenig = false;
			}
		})
	}

	data["modul"] = "such";

	if (wenig) {
		$('#liste').empty();
		var tr = $('<tr />').appendTo('#liste');
		$('<td/>', {
			html : "<center><h1>Suche nach mindestens 3 Buchstaben</h1></center>",
			colspan : 7
		}).appendTo(tr);

		$('#liste').show();
		$('#wait').hide();
	} else {
		$.ajax({
			url : 'api.php',
			cache : false,
			type : 'POST',
			data : data,
			success : function(data) {
				if (data == "null") {
					$("#counter").text("0 Treffer");
					$('#liste').empty();
					var tr = $('<tr />').appendTo('#liste');
					$('<td/>', {
						html : "<center><h1>Keinen Treffer :-( </h1></center>",
						colspan : 7
					}).appendTo(tr);

					$('#liste').show();
					$('#wait').hide();
				} else {
					data = JSON.parse(data);
					$("#counter").text(data["members"].length + " Treffer");
					if (data["members"].length == 1) {
						showMember(data["members"][0]["dbid"]);
					} else {
						buildAutocomplete(data["autocomplete"]);
						buildTable(data["members"]);
					}
				}
			}
		}).fail(function(data) {
			alert(data.responseText);
		});
	}
}

function such_enter(e) {
	if ( typeof e == 'undefined' && window.event) {
		e = window.event;
	}
	if (e.keyCode == 13) {
		such();
	}
}

function reset() {
	$.each($("input"), function(key, val) {
		val.value = "";
	});
	document.getElementById("name").focus();
	window.scrollTo(0, 0);
	buildAutocomplete(autocompleteBase);
}

document.onkeypress = function(e) {
	TimeOut = 600;
	if (!e)
		e = window.event;
	if (e.ctrlKey) {
		switch(e.keyCode) {
			case 18:
				// R
				reset();
				break;
			case 12:
				// L
				//show_last();
				break;
		}

		//alert("Strg+"+e.keyCode);
		return false;
	}
}
function ZeitAnzeigen() {
	var Jetzt = new Date();
	var Tag = Jetzt.getDate();
	var Monat = Jetzt.getMonth() + 1;
	var Jahr = Jetzt.getYear();
	if (Jahr < 999)
		Jahr += 1900;
	var Stunden = Jetzt.getHours();
	var Minuten = Jetzt.getMinutes();
	var Sekunden = Jetzt.getSeconds();
	var WoTag = Jetzt.getDay();
	var Vortag = (Tag < 10) ? "0" : "";
	var Vormon = (Monat < 10) ? ".0" : ".";
	var Vorstd = (Stunden < 10) ? "0" : "";
	var Vormin = (Minuten < 10) ? ":0" : ":";
	var Vorsek = (Sekunden < 10) ? ":0" : ":";
	var Datum = Vortag + Tag + Vormon + Monat + "." + Jahr;
	var Uhrzeit = Vorstd + Stunden + Vormin + Minuten + Vorsek + Sekunden;
	var Gesamt = Uhrzeit + " - " + Datum;

	$("#uhr").text(Gesamt);
	window.setTimeout("ZeitAnzeigen()", 1000);
}

function last() {
	$('#wait').show();
	$.ajax({
		url : 'api.php',
		cache : false,
		type : 'POST',
		data : {
			"modul" : "last"
		},
		success : function(data) {
			if (data == "null") {
				$("#counter").text("0 Treffer");
				$('#liste').empty();
				var tr = $('<tr />').appendTo('#liste');
				$('<td/>', {
					html : "<center><h1>Keinen Treffer :-( </h1></center>",
					colspan : 7
				}).appendTo(tr);

				$('#liste').show();
				$('#wait').hide();
			} else {
				data = JSON.parse(data);
				$("#counter").text(data.length + " Treffer");
				buildTable(data);
			}

		}
	}).fail(function(data) {
		alert(data.responseText);
	})
}

function init() {
	$.ajax({
		url : 'api.php',
		cache : false,
		type : 'POST',
		data : {
			"modul" : "autocomplete"
		},
		success : function(data) {
			autocompleteBase = JSON.parse(data);
			buildAutocomplete(autocompleteBase);

			$('#content').show();
			$('#wait').hide();
			reset();
			window.setTimeout('Ticker()', 1000);
		}
	}).fail(function(data) {
		alert(data.responseText);
	})
}

function login() {
	$.ajax({
		url : 'login.php',
		cache : false,
		type : 'POST',
		data : {
			"login" : $("#username").val(),
			"password" : $("#password").val()
		},
		success : function(data) {
			window.location.reload();
		}
	}).fail(function(data) {
		$("#login_error").show();
	})
}

function logout() {
	$.ajax({
		url : 'login.php',
		cache : false,
		type : 'POST',
		data : {
			"logout" : true
		},
		success : function(data) {
			window.location.reload();
		}
	}).fail(function(data) {
		alert("Logout hat nicht geklappt. oO");
	})
}

function report(url) {
	$('#report').empty().css('color', '').csv2table(url);
	$("#dialog").prop('title', 'Data Report').dialog({
		autoOpen : true,
		buttons : [],
		width : '99%',
		position : [0, 60]

	});
}

function Ticker() {
	TickerCount = TickerCount + 1;
	if (TickerCount >= 20) {
		TickerCount = 0;
		$.ajax({
			url : 'api.php',
			cache : false,
			type : 'POST',
			data : {
				"modul" : "info"
			},
			success : function(data) {
				data = JSON.parse(data);
				$("#Akked").text(data["akked"] + " Person Akkreditiert")

			}
		})
	}
	window.setTimeout('Ticker()', 1000);

	TimeOut = TimeOut - 1;
	if (TimeOut == 0) {
		$('#report').text("Die Session läuft gleich ab!");
		$("#dialog").prop('title', 'Warnung').dialog({
			buttons : [{
				text : "Abmelden",
				class : "btn btn-danger",
				click : function() {
					logout();
				}
			}, {
				text : "Weiterarbeiten",
				class : "btn btn-success",
				click : function() {
					TimeOut = 600;
					$(this).dialog("close");
				}
			}],
			autoOpen : true,
			width : 'auto',
			position : 'center'
		});
	}
	if (TimeOut <= -30) {
		logout();
	}
}

$(function() {
	$.ajax({
		url : 'login.php',
		cache : false,
		type : 'GET',
		success : function(data) {
			$("#loged_user").text("User: " + data);
			init();
		}
	}).fail(function(data) {
		$("#wait").hide();
		$("#login").show();
		$("#username").focus();
	})
	window.setTimeout('ZeitAnzeigen()', 1000);
});
