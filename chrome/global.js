API_URL = "http://idea2.api.inthis.space";

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
