function send_tabs() {
	var listname = prompt("Name your tab list:");
	var to_user = prompt("Send to whom?");
	chrome.tabs.query({"currentWindow": true}, function(tabs) {
		api_newlist(to_user, listname, tabs.map(function() { return this.url; }));
	});
}

function api_newlist(user, listname, links) {
	$.post(API_URL + '/u/' + user, {'name': listname, 'links': JSON.stringify(links)});
}

function chrome_open_tab_urls(tab_urls) {
	tab_urls.forEach(function(tab) {
		chrome.tabs.create({"url": tab});
	});
}

function open_list(user, listname) {
	//chrome.browserAction.setIcon({'path': 'icon.png'});
	api_links(user, listname, function(links, ok) {
		if (typeof links !== "undefined") { chrome_open_tab_urls(links); }
	});
}

function chrome_log_out() {
	chrome.storage.sync.clear();
	location.reload();
}

function chrome_log_in(username) {
	chrome.storage.sync.set({"username": username});
}

function chrome_get_lists() {
	chrome.storage.sync.get("lists", function(items) {
		if (typeof items === "undefined") { return; }
		return items.lists;
	});
}

function jq_load() {
	//chrome.browserAction.setIcon({"path": "icon.png"});

	$('input').keyup(function(ev) {
		// if return is pressed in the input field
		username = $(this).val();
		if ((ev.which == 13) && (username !== '')) {
			console.log("Return pressed.");
			chrome_log_in(username);
			jq_load();
		}
	});

	var zeroth_list = $("div.list");

	chrome_username(function(username, is_logged_in) {
		if (!is_logged_in) { return; }

		$('input').hide();
		$("div#log-out").show();
		$("div#log-out").click(chrome_log_out);
		$("div#share-tabs").show();
		$("div#share-tabs").click(send_tabs);

		var lists = chrome_get_lists();
		if (typeof lists === "undefined") { return; }
		zeroth_list.hide();

		var generic_list = first_list.clone();
		generic_list("div.buttons").show();

		lists.forEach(function(list) {
			var thisone = generic_list.clone();
			thisone("a.name").text(list).click(function() { open_list(username, list); });
			insertAfter("div.credentials");
		});
	});
}

//chrome.storage.onChanged.addListener(function(changes) {
$(document).ready(function() {
	jq_load();
});
