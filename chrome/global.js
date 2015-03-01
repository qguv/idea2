function chrome_username() {
	chrome.storage.sync.get("username", function(items) {
		if (typeof items === "undefined") { return; }
		return items.username;
	});
}

function chrome_is_logged_in() {
	return (typeof chrome_username() !== "undefined");
}
