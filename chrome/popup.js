function send_tabs() {
	listname = prompt("Name your tab list:");
	to_user = prompt("Send to whom?");
	chrome.tabs.query({"currentWindow": true}, function(tabs) {
		api_newlist(target_user, listname, tabs.map(function() { return this.url; }));
	});
}

function api_newlist(user, listname, links) {
	$.post(API_URL + '/u/' + user, {'name': listname, 'links': JSON.stringify(links)});
}

function jq_populatelists(urls) {
	// do some dumb web dev shit here
	// FIXME
}

function jq_load() {
	location.reload();
	// FIXME
}

function chrome_open_tab_urls(tab_urls) {
	tab_urls.forEach(function(tab) {
		chrome.tabs.create({"url": tab});
	});
}

function chrome_log_out() {
	chrome.storage.sync.clear();
}

function chrome_log_in(username) {
	chrome.storage.sync.set({"username": username});
}

function open_list(user, listname) {
	chrome_open_tab_urls(api_links(user, listname));
}

chrome.storage.onChanged.addListener(function() { jq_load(); });

chrome.browserAction.setIcon({'path': 'icon.png'});
