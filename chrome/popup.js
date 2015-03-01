function set_username(username) {
	chrome.storage.sync.set({"username": username}, function() {	
	});
}
