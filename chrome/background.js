API_URL = "http://idea2.api.inthis.space";

function chrome_update_lists() {
	chrome_username(function(username, is_logged_in) {
		if (is_logged_in) {
			api_lists(username, function(lists) {
				chrome_save_lists(lists)
			});
		}
	});
}

function chrome_save_lists(lists) {
	chrome.storage.sync.set({"lists": lists});
	// TODO: use globals and access with chrome.extension.getBackgroundPage() 
}

// callback: function(links, ok)
function api_lists(user, callback) {
	$.get(API_URL + '/u/' + user, {}, function(page) {
		if (typeof page === "undefined") {
			callback(page, false);
		} else {
			callback(page.lists, (typeof page.lists !== "undefined"));
		}
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

// callback: function(links, ok)
function api_links(user, listname, callback) {
	$.get(API_URL + '/u/' + user + '/' + listname, function(page) {
		if (typeof page === "undefined") {
			callback(page, false);
		} else {
			callback(page.links, (typeof page.links !== "undefined"));
		}
	});
}

// check the db every 5s
setInterval(chrome_update_lists, 5000);
