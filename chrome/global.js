API_URL = "http://idea2.api.inthis.space";

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

// callback: whatever man
function chrome_save_lists(lists, callback) {
	chrome.storage.sync.set({"lists": lists}, callback);
	// TODO: use globals and access with chrome.extension.getBackgroundPage()
}

// callback: whatever man
function chrome_update_lists(callback) {
	chrome_username(function(username, is_logged_in) {
		if (is_logged_in) {
			api_lists(username, function(lists, ok) {
				if (!ok) {
					console.log("Couldn't get lists!");
					return;
				}
				console.log("Saving lists", lists);
				chrome_save_lists(lists, callback);
			});
		}
	});
}

// callback: function(username, is_logged_in)
function chrome_username(callback) {
	chrome.storage.sync.get("username", function(items) {
		if (typeof items === "undefined") {
			callback(items, false);
		} else {
			callback(items.username, (typeof items.username !== "undefined"));
		}
	});
}
