// callback: standard JSON ajax callback
function send_tabs(to_user, listname, callback) {
	chrome.tabs.query({"currentWindow": true}, function(tabs) {
		api_newlist(to_user, listname, tabs.map(function(tab) { return tab.url; }), callback);
	});
}

// callback: standard JSON ajax callback
function api_newlist(user, listname, links, callback) {
	$.post(API_URL + '/u/' + user, {'name': listname, 'links': JSON.stringify(links)}, callback);
}

// callback: standard JSON ajax callback
function api_rmlist(user, listname, callback) {
	$.ajax({
		url: API_URL + '/u/' + user + '/' + listname,
		type: 'DELETE',
		success: callback,
		failure: callback
	});
}

// callback: standard JSON ajax callback
function api_mvlist(user, listname, rename, callback) {
	$.post(API_URL + '/u/' + user + '/' + listname, {'rename': rename}, callback);
}

// callback: function(links, ok)
function api_links(user, listname, callback) {
	$.getJSON(API_URL + '/u/' + user + '/' + listname, function(data) {
		if (typeof data === "undefined") {
			callback(data, false);
		} else {
			callback(data.links, (typeof data.links !== "undefined"));
		}
	});
}

function chrome_open_tab_urls(tab_urls) {
	tab_urls.forEach(function(tab) {
		chrome.tabs.create({"url": tab});
	});
}

function open_list(user, listname) {
	//chrome.browserAction.setIcon({'path': 'icon.png'});
	api_links(user, listname, function(links, ok) {
		if (ok) {
			links.reverse();
			chrome_open_tab_urls(links);
		}
	});
}

function chrome_log_out() {
	chrome.storage.sync.clear();
	location.reload();
}

// callback: whatever man
function chrome_log_in(username, callback) {
	chrome.storage.sync.set({"username": username}, callback);
}

// callback: function(lists, ok, [empty])
function chrome_get_lists(callback) {
	chrome.storage.sync.get("lists", function(items) {
		if (typeof items === "undefined") { callback(items, false, false); }
		var ok = (typeof items.lists !== "undefined");
		var empty = (ok && (items.lists.length == 0));
		callback(items.lists, ok, empty);
	});
}

// bindfn: function(value of field)
function return_binding(jquery_object, bindfn) {
	$(jquery_object).keyup(function(ev) {
		// if return is pressed in the input field
		var value = $(this).val();
		if ((ev.which == 13) && (value !== '')) {
			bindfn(value);
		}
	});
}

function jq_form_visibility(to_be_visible) {
	chrome_update_lists();
	if (!to_be_visible) { location.reload(); return; }
	$("a.share-tabs").hide()
	$("div.list").hide();
	$("div.share-form").show();

	$("a.cancel-share-tabs").click(function() { jq_form_visibility(false); });
	$("a.submit-share-tabs").click(function() {
		var target_user = $("input#target_user").val();
		var list_name = $("input#list_name").val();
		$(this).text("Sending...");
		send_tabs(target_user, list_name, function() {
			chrome_update_lists(function() {
				location.reload();
			});
		});
	});

	$("input#target_user").focus();
	$("input#target_user").select();
	return_binding("input#target_user", function() {
		$("input#list_name").focus();
		$("input#list_name").select();
	});

	return_binding("input#list_name", function() {
		$("a.submit-share-tabs").click();
	});
}

function jq_load() {
	//chrome.browserAction.setIcon({"path": "icon.png"});

	return_binding('input#username', function(username) {
		chrome_log_in(username, function() {
			chrome_update_lists(function() {
				location.reload();
			});
		});
	});

	chrome_username(function(username, is_logged_in) {
		if (!is_logged_in) {
			$("input#username").show();
			$("div#logged-in-buttons").hide();
			return;
		}
		console.log("Logged in as", username + ".");

		$("a.log-out").click(chrome_log_out);
		$("a.share-tabs").click(function() { jq_form_visibility(true); });

		chrome_get_lists(function(lists, ok, empty) {
			var none = (!ok || empty);
			jq_populate(username, lists, none);
		});
	});
}

function jq_populate(username, lists, none) {

	$("div#lists").find("div.list").not(".prototype").remove();
	var zeroth_list = $("div.prototype");

	if (none) {
		zeroth_list.show();
		return;
	}
	console.log("Got lists:", lists);

	var generic_list = $(zeroth_list).clone().removeClass("prototype");
	$(generic_list).find("div.listbuttons").show();

	lists.forEach(function(list) {
		var thisone = $(generic_list).clone().appendTo("div#lists").show();
		$(thisone).find("a.name").text(list).click(function() { open_list(username, list); })
		$(thisone).find("a.rename").click(function() {
			var ren = this;
			$(ren).text("v1.0...");
			setTimeout(function() {
				$(ren).text("Rename");
			}, 2000);
		});
		$(thisone).find("a.delete").click(function() {
			$(thisone).find("a.rename").hide();
			$(this).text("Deleting...");
			api_rmlist(username, list, function() {
				chrome_update_lists(function() {
					location.reload();
				});
			});
		});
	});
}

//chrome.storage.onChanged.addListener(function(changes) {
$(document).ready(function() {

	// quick load from cache
	jq_load();

	// update from server (slow)
	chrome_update_lists(function() {

		// overwrite current lists with updated lists from server
		jq_load();

	});
});
