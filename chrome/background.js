function send_tabs(target_user) {
	chrome.tabs.query({"currentWindow": true}, function(result) {
		// jquery send the tabs
	});
}

function open_tabs(tabs) {
	for (var i = 0; i < tabs.length; i++) {
		chrome.tabs.create({"url": tabs[i]});
	}
}

function query_tabs() {
	// check the db
	// if new stuff is on the server, show it
}

setInterval(function() { // check the db every 5s
	query_tabs();
}, 5000);

function api_newlist(user, listname, links) {
	$.post('/u/'+user, {'name': listname, 'links': JSON.stringify(links)});
}

function api_lists(user) {
	$.get('/u/' + user, {}, jq_populatelists(ret));
}

function api_rmlist(user, listname) {
	$.ajax({
		url: '/u/' + user + '/' + listname,
		type: 'DELETE'
	});
}

function api_mvlist(user, listname, rename) {
	$.post('/u/'+user+'/'+listname, {'rename': rename});
}

function api_links(user, listname) {
	$.get('/u/' + user + '/' + listname);
}

function jq_populatelists(ret) {
	// do some dumb web dev shit here
}
