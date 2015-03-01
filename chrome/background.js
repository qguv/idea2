API_URL = "http://idea2.api.inthis.space"

function send_tabs(target_user) {
	chrome.tabs.query({"currentWindow": true}, function(result) {
		// jquery send the tabs
	});
}

function open_tabs(tab_urls) {
	for (var i = 0; i < tabs.length; i++) {
		chrome.tabs.create({"url": tab_urls[i]});
	}
}

function query_tabs() {
	// check the db
	// if new stuff is on the server, show it
}

function api_newlist(user, listname, links) {
	$.post(API_URL + '/u/' + user, {'name': listname, 'links': JSON.stringify(links)});
}

function api_lists(user) {
	$.get(API_URL + '/u/' + user, {}, jq_populatelists(ret));
}

function api_rmlist(user, listname) {
	$.ajax({
		url: API_URL + '/u/' + user + '/' + listname,
		type: 'DELETE'
	});
}

function api_mvlist(user, listname, rename) {
	$.post(API_URL + '/u/' + user + '/' + listname, {'rename': rename});
}

function api_links(user, listname) {
	$.get(API_URL + '/u/' + user + '/' + listname);
}

function jq_populatelists(ret) {
	// do some dumb web dev shit here
}

// check the db every 5s
setInterval(function() {query_tabs();}, 5000);
