function chrome_username() {
	chrome.storage.sync.get("username", function(items) {
		if (typeof items === "undefined") { return; }
		return items.username;
	});
}

