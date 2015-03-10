// check the db every 5s
$(document).ready(function() {
	var seconds = 1000;
	setInterval(chrome_update_lists, 10 * seconds);
});
