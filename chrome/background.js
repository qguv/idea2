function chrome_update_lists() {
	chrome_username(function(username, is_logged_in) {
		if (is_logged_in) {
			api_lists(username, function(lists, ok) {
				if (!ok) {
					console.log("Couldn't get lists!");
					return;
				}
				chrome_save_lists(lists);
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
	$.getJSON(API_URL + '/u/' + user, {}, function(data) {
		if (typeof data === "undefined") {
			callback(data, false);
		} else {
			callback(data.lists, (typeof data.lists !== "undefined"));
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
	$.getJSON(API_URL + '/u/' + user + '/' + listname, function(data) {
		if (typeof data === "undefined") {
			callback(data, false);
		} else {
			callback(data.links, (typeof data.links !== "undefined"));
		}
	});
}

// check the db every 5s
$(document).ready(function() {
	setInterval(chrome_update_lists, 5000);
});
