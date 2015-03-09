API_URL = "http://idea2.api.inthis.space";

function send_tabs() {
	var listname = prompt("Name your tab list:");
	var to_user = prompt("Send to whom?");
	chrome.tabs.query({"currentWindow": true}, function(tabs) {
		api_newlist(target_user, listname, tabs.map(function() { return this.url; }));
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
	chrome_open_tab_urls(api_links(user, listname));
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
	chrome.browserAction.setIcon({"path": "icon.png"});

	var zeroth_list = $("div.list");
	if (!chrome_is_logged_in()) {
		chrome_log_in(prompt("Please log in to idea2. Choose a username:", "tswift"));
	}
	var username = chrome_username();

	//$("div.credentials").removeClass("hidden");
	$("div.credentials").click(function() { alert("Handled."); });
	//$("a.credentials").click(function() { chrome_log_out(); });
	$("div.share").removeClass("hidden");

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
}

//chrome.storage.onChanged.addListener(function(changes) {
$(document).ready(function() {
	jq_load();
});
