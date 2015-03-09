API_URL = "http://idea2.api.inthis.space";

function chrome_update_lists() {
	if (!chrome_is_logged_in()) { return; }
	api_lists(chrome_username(), function(lists) { chrome_save_lists(lists) });
}

function chrome_save_lists(lists) {
	chrome.storage.sync.set({"lists": lists});
	// TODO: use globals and access with chrome.extension.getBackgroundPage() 
}

function api_lists(user, callback) {
	$.get(API_URL + '/u/' + user, {}, function(page) {
		if (typeof page === "undefined") { return; }
		callback(page.lists);
	});
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

function api_links(user, listname, callback) {
	$.get(API_URL + '/u/' + user + '/' + listname, function(page) {
		if (typeof page === "undefined") { return; }
		callback(page.links);
	});
}

// check the db every 5s
setInterval(chrome_update_lists, 5000);
